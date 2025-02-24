import { useConnectModal, useAccount } from "@web3modal/react"
import { create, CID } from "ipfs-http-client"
import { nanoid } from "nanoid"
import qrcode from "qrcode-generator"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Spinner, ProgressBar } from "_components"
import { useEmojis } from "../hooks/useEmojis"
import { usePusher } from "../hooks/usePusher"
import imageStyles from "../styles/image.module.css"
import styles from "../styles/CreatePage.module.css"
import homeStyles from "../styles/HomePage.module.css"
import ethers from "ethers";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";

const INFURA_PROJECTID = process.env.NEXT_PUBLIC_INFURA_PROJECTID
const INFURA_APISECRET = process.env.NEXT_PUBLIC_INFURA_APISECRET

const now = Date.now()

const CreatePage = () => {
  const { emoji } = useEmojis()
  const { open } = useConnectModal()

  const { account } = useAccount()
  // const channelName = 'channel' // nanoid()
  const { address: channelName, isConnected, isConnecting } = useMemo(
    () => account,
    [account]
  )
  console.log("channelName", channelName)

  const { channel, pushMessage } = usePusher(channelName)

  const imagePreviewRef = useRef(null)
  const inputFileRef = useRef(null)
  const ipfsRef = useRef(null)
  const qrcodeDivRef = useRef(null)

  const [locationText, setLocationText] = useState()
  console.log(locationText)
  // const locationText = "POM"
  const [showQrCode, setShowQrCode] = useState(false)
  const [showLocation, setShowLocation] = useState(true)
  const [showTakeSelfie, setShowTakeSelfie] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hasImage, setHasImage] = useState(false)
  const [emojiIsCorrect, setEmojiIsCorrect] = useState()
  console.log('emojiIsCorrect', emojiIsCorrect)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [randomEmojiKey, setRandomEmojiKey] = useState(null)

  const onClickNext = useCallback(() => {
    if (emojiIsCorrect) {
setSuccess(true)
      return
    }

    if (showLocation) {
      setShowLocation(false)
      setShowQrCode(true)
      return
    }
    if (showQrCode) {
      setShowQrCode(false)
    }
    if (hasImage) {
      setShowTakeSelfie(false)
    }
    if (showTakeSelfie) {
      const inputFile = inputFileRef.current
      if (!inputFile) return
      inputFile.click()
    }
  }, [
    inputFileRef,
    hasImage,
    showLocation,
    showQrCode,
    setSuccess,
    showTakeSelfie,
    setShowTakeSelfie,
    setShowQrCode,
    setShowLocation,
    emojiIsCorrect
  ])

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
        setShowTakeSelfie(false)
        const ipfsImage = await ipfs.add(file)
        setUploadedImage({ cid: ipfsImage.cid, path: ipfsImage.path })
      }
    },
    [imagePreviewRef, ipfsRef, setHasImage, setShowTakeSelfie, setUploadedImage]
  )

  const { completed, labelText, subLabelText, buttonText } = useMemo(() => {
    if(success) return {
        completed: 0,
        buttonText: "",
        labelText: "Done!",
        subLabelText:
          "",
    }

    if (showLocation)
      return {
        completed: 20,
        buttonText: "Generate QR code",
        labelText: "Where are you at?",
        subLabelText:
          "Tell us where you are right now to adequately describe your Proof of Meet",
      }

    if (showQrCode)
      return {
        completed: 40,
        buttonText: "",
        labelText: "Show this code to your new connection",
        subLabelText:
          "Scan QR code with the regular camera, or use a WalletConnect-compatible wallet",
      }

    if (emojiIsCorrect)
      return {
        completed: 100,
        buttonText: "We're ready to publish",
        labelText: "Code confirmed!",
        subLabelText:
          "This is the last step. Please double-check the info below is correct",
      }

    if (showTakeSelfie)
      return {
        completed: 60,
        buttonText: "Take selfie",
        labelText: "Take a picture together",
        subLabelText: "Smile, it’s gonna live on forever!",
      }

    if (hasImage)
      return {
        completed: 80,
        labelText: "",
        labelText: "Show this code to your connection",
        subLabelText: "This step is to ensure you both consent",
      }

    return {
      completed: 0,
      buttonText: "",
      labelText: "",
      subLabelText: "",
    }
  }, [success,emojiIsCorrect, showLocation, showQrCode, hasImage])

  const onChangeInput = useCallback(
    (event) => {
      setLocationText(event.target.value)
    },
    [setLocationText]
  )

  const onClick = useCallback(() => {
    if (isConnected) return
    if (isConnecting) return
    open()
  }, [isConnected, isConnecting, open])

  const takePhotoButtonIsHidden = useMemo(() => {
    if (hasImage) return true
    return !emojiIsCorrect
  }, [hasImage, emojiIsCorrect])

  const onSubmitImage = useCallback((event) => {
    event.preventDefault()
  }, [])

  useEffect(() => {
    if (!channelName) return
    if (!hasImage) return
    pushMessage({ eventName: "image", message: "ok" })
  }, [channelName, pushMessage, hasImage])

  useEffect(() => {
    const emojiKeys = Object.keys(emoji)
    setRandomEmojiKey(emojiKeys[now % emojiKeys.length])
  }, [emoji, setRandomEmojiKey])

  useEffect(() => {
    if (!channel) return
    channel.bind("connected", () => {
      setShowQrCode(false)
      setShowTakeSelfie(true)
    })
  }, [channel, setShowQrCode, setShowTakeSelfie])

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
    if (!channelName) return
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
  }, [qrcodeDivRef, channelName])

  return (
    <>
      <ProgressBar completed={completed} />

      <div className={styles.background}>
        <div className={styles.container}>
          <form className={styles.imageForm} onSubmit={onSubmitImage}>
            <label className={styles.label} htmlFor="place">
              {labelText}
            </label>
            <p className={styles.subLabel}>{subLabelText}</p>
            {showLocation && !success && (
              <input
                className={styles.placeInput}
                type="text"
                placeholder="Event, location"
                onChange={onChangeInput}
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

            {hasImage && !success && (
              <div className={styles.connectionCode}>
                <div
                  className={`${styles.emojiContainer} ${
                    emojiIsCorrect ? styles.emojiIsCorrect : ""
                  }`}
                >
                  <div className={styles.emoji}>{emoji[randomEmojiKey]}</div>
                </div>
              </div>
            )}

            {hasImage && (
              <>
                {emojiIsCorrect ? null : (
                  <div className={styles.waiting}>
                    <Spinner />
                    <div className={styles.subLabel}>
                      waiting for your connection to confirm…
                    </div>
                  </div>
                )}
              </>
            )}

            <img
              ref={imagePreviewRef}
              hidden={!hasImage}
              className={imageStyles.preview}
            />

            {emojiIsCorrect && (
              <div>
                <span className={styles.message}>{locationText}</span>
                <br />
                <span className={styles.timestamp}>
                  {new Date(now).toLocaleString()}
                </span>
              </div>
            )}

            <div
              ref={qrcodeDivRef}
              className={styles.qrcodeContainer}
              hidden={!showQrCode}
            ></div>
          </form>

          {channelName ? (
            <>
              {buttonText && (
                <button className={styles.next} onClick={onClickNext}>
                  {buttonText}
                </button>
              )}
            </>
          ) : (
            <button className={homeStyles.callToAction} onClick={onClick}>
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default CreatePage
