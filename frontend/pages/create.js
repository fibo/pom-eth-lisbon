import { create, CID } from "ipfs-http-client"
import { nanoid } from "nanoid"
import qrcode from "qrcode-generator"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ProgressBar } from "_components"
import { useEmojis } from "../hooks/useEmojis"
import { usePusher } from "../hooks/usePusher"
import imageStyles from "../styles/image.module.css"
import styles from "../styles/CreatePage.module.css"

const INFURA_PROJECTID = process.env.NEXT_PUBLIC_INFURA_PROJECTID
const INFURA_APISECRET = process.env.NEXT_PUBLIC_INFURA_APISECRET

const channelName = nanoid()
console.log(channelName)
const now = Date.now()

const CreatePage = () => {
  const { emoji } = useEmojis()

  const { channel } = usePusher(channelName)

  const imagePreviewRef = useRef(null)
  const inputFileRef = useRef(null)
  const ipfsRef = useRef(null)
  const qrcodeDivRef = useRef(null)

  const [showQrCode, setShowQrCode] = useState(false)
  const [showLocation, setShowLocation] = useState(true)
  const [hasImage, setHasImage] = useState(false)
  const [emojiIsCorrect, setEmojiIsCorrect] = useState()
  console.log("emojiIsCorrect", emojiIsCorrect)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [randomEmojiKey, setRandomEmojiKey] = useState(null)
  console.log("uploadedImage", uploadedImage)

  const onClickNext = useCallback(() => {
    if (showLocation) {
    setShowLocation(false)
    setShowQrCode(true)
      return
    }
    if (showQrCode) {
    setShowQrCode(false)
    const inputFile = inputFileRef.current
    if (!inputFile) return
    inputFile.click()
    }
  },[
    inputFileRef,
    showLocation,
    showQrCode,
    setShowQrCode,
     setShowLocation])

  const onChangeImage = useCallback(
    async (event) => {
      const imagePreview = imagePreviewRef.current
      if (!imagePreview) return
      const ipfs = ipfsRef.current
      if (!ipfs) return
      const files = event.target.files
      if (files.length === 1 && files[0].type.match(/^image\//)) {
        const file = files[0]
        imagePreview.src = URL.createObjectURL(file)
        setHasImage(true)
        const ipfsImage = await ipfs.add(file)
        setUploadedImage({ cid: ipfsImage.cid, path: ipfsImage.path })
      }
    },
    [imagePreviewRef, ipfsRef, setHasImage, setUploadedImage]
  )

  const {completed, labelText, subLabelText, buttonText} = useMemo(() => {
    if (showLocation) return {
       completed: 25,
      buttonText: 'Generate QR code',
      labelText: 'Where are you at?',
      subLabelText: "Tell us where you are right now to adequately describe your Proof of Meet"
    }

    if (showQrCode) return {
       completed: 50,
      buttonText: 'Take selfie',
      labelText: 'Show this code to your new connection',
      subLabelText: "Scan QR code with the regular camera, or use a WalletConnect-compatible wallet"
    }

    if (hasImage) return {
       completed: 75,
      labelText: '',
      labelText: 'Show this code to your connection',
      subLabelText: "This step is to ensure you both consent"
    }

     return {
       completed: 0,
      buttonText: '',
      labelText: '',
      subLabelText: ""
    }
  }, [showLocation, showQrCode,hasImage])

  const takePhotoButtonIsHidden = useMemo(() => {
    if (hasImage) return true
    return !emojiIsCorrect
  }, [hasImage, emojiIsCorrect])

  const onSubmitImage = useCallback((event) => {
    event.preventDefault()
  }, [])


  useEffect(() => {
    const emojiKeys = Object.keys(emoji)
    setRandomEmojiKey(emojiKeys[now % emojiKeys.length])
  }, [emoji, setRandomEmojiKey])

  useEffect(() => {
    if (!channel) return
    channel.bind("emoji", ({ message }) => {
      if (randomEmojiKey === message) setEmojiIsCorrect(true)
    })
  }, [channel, randomEmojiKey, setEmojiIsCorrect])

  useEffect(() => {
    try {
      if (ipfsRef.current) return
      const auth = "Basic " + btoa(INFURA_PROJECTID + ":" + INFURA_APISECRET)
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth,
        },
      })
      ipfsRef.current = ipfs
    } catch (error) {
      console.error(error)
    }
  }, [ipfsRef])

  useEffect(() => {
    if (!qrcodeDivRef.current) return
    const connectUrl = `${window.location.origin}/connect/${channelName}`
    const typeNumber = 0
    const errorCorrectionLevel = "L"
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData(connectUrl)
    qr.make()
    qrcodeDivRef.current.innerHTML = qr.createSvgTag({
      scalable: true,
      cellSize: 4,
    })
  }, [qrcodeDivRef])

  return (
    <>
      <ProgressBar completed={completed} />

      <div className={styles.background}>
      <div className={styles.container}>
        <form className={styles.imageForm} onSubmit={onSubmitImage}>
          <label className={styles.label} htmlFor="place">
            {labelText}
          </label>
          <p className={styles.subLabel}>
            {subLabelText}
          </p>
          {showLocation && (
          <input
            className={styles.placeInput}
            type="text"
            placeholder="Event, location"
          />
          )}

          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            capture
            onChange={onChangeImage}
            hidden
          />


    {hasImage && (
        <div  className={styles.connectionCode}>

          <div className={styles.emojiContainer}>
            <div className={styles.emoji}>{emoji[randomEmojiKey]}</div>
          </div>
        </div>
    )}

        <img
          ref={imagePreviewRef}
          hidden={!hasImage}
          className={imageStyles.preview}
        />

        </form>

        <div ref={qrcodeDivRef} className={styles.qrcodeContainer} hidden={!showQrCode}></div>

    {buttonText &&(
        <button className={styles.next} onClick={onClickNext}>{buttonText}</button>
    )}
      </div>
      </div>
    </>
  )
}

export default CreatePage
