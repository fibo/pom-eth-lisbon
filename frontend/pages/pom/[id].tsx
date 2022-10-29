import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ConnectButton } from "_components"
import styles from "../../styles/imagePreview.module.css"

const INFURA_GATEWAY = process.env.NEXT_PUBLIC_INFURA_GATEWAY

const PomPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [imageUrl, setImageUrl] = useState("")

  console.log(id)
  useEffect(() => {
    if (!id) return
    setImageUrl(`https://${INFURA_GATEWAY}.infura-ipfs.io/ipfs/${id}`)
  }, [id, setImageUrl])

  return (
    <>
      <p>POM: {id}</p>
      <ConnectButton />
      <img className={styles.imagePreview} src={imageUrl} alt="" />
    </>
  )
}

export default PomPage
