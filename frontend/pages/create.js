import { create, CID } from "ipfs-http-client"
import qrcode from "qrcode-generator"
import { useCallback, useEffect, useRef, useState } from "react"
import { ProgressBar } from "_components"
import imageStyles from "../styles/image.module.css"
import styles from "../styles/CreatePage.module.css"

const INFURA_PROJECTID = process.env.NEXT_PUBLIC_INFURA_PROJECTID
const INFURA_APISECRET = process.env.NEXT_PUBLIC_INFURA_APISECRET

const CreatePage = () => {
  const imagePreviewRef = useRef(null)
  const inputFileRef = useRef(null)
  const ipfsRef = useRef(null)
  const qrcodeDivRef = useRef(null)

  const [hasImage, setHasImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const onClickTakePhoto = useCallback(() => {
    const inputFile = inputFileRef.current
    if (!inputFile) return
    inputFile.click()
  }, [inputFileRef])

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

  const onSubmitImage = useCallback((event) => {
    event.preventDefault()
  }, [])

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
    if (!uploadedImage) return
    const pomUrl = `${window.location.origin}/pom/${uploadedImage.path}`
    const typeNumber = 0
    const errorCorrectionLevel = "L"
    const qr = qrcode(typeNumber, errorCorrectionLevel)
    qr.addData(pomUrl)
    qr.make()
    qrcodeDivRef.current.innerHTML = qr.createSvgTag({
      scalable: true,
      cellSize: 4,
    })
  }, [qrcodeDivRef, uploadedImage])

  return (
    <>
      <ProgressBar completed={25} />

      <h1 className={styles.title}>Create new POM</h1>

      <div className={styles.container}>
        <form className={styles.imageForm} onSubmit={onSubmitImage}>
          <label className={styles.placeLabel} htmlFor="place">
            Where are you at?
          </label>
          <input
            className={styles.placeInput}
            type="text"
            placeholder="Event, location"
          />

          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            capture
            onChange={onChangeImage}
            hidden
          />
          <button onClick={onClickTakePhoto} hidden={hasImage}>
            take photo
          </button>
        </form>

        <img
          ref={imagePreviewRef}
          hidden={!hasImage}
          className={imageStyles.preview}
        />

        <div ref={qrcodeDivRef}></div>
      </div>
    </>
  )
}

export default CreatePage
