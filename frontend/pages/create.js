import { create, CID } from "ipfs-http-client"
import { useCallback, useEffect, useRef, useState } from "react"
import styles from "../styles/imagePreview.module.css"

const INFURA_PROJECTID = process.env.NEXT_PUBLIC_INFURA_PROJECTID
const INFURA_APISECRET = process.env.NEXT_PUBLIC_INFURA_APISECRET

const CreatePage = () => {
  const imagePreviewRef = useRef(null)
  const ipfsRef = useRef(null)

  const [hasImage, setHasImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

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

  return (
    <>
      <form onSubmit={onSubmitImage}>
        <input type="file" accept="image/*" capture onChange={onChangeImage} />
      </form>
      <img
        ref={imagePreviewRef}
        hidden={!hasImage}
        className={styles.preview}
      />
    </>
  )
}

export default CreatePage
