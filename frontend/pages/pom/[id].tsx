import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ConnectButton } from "_components"
import imageStyles from "../../styles/image.module.css"

const INFURA_GATEWAY = process.env.NEXT_PUBLIC_INFURA_GATEWAY

const PomPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (!id) return
    setImageUrl(`https://${INFURA_GATEWAY}.infura-ipfs.io/ipfs/${id}`)
  }, [id, setImageUrl])

  return (
    <>
      <ConnectButton />
      <img className={imageStyles.preview} src={imageUrl} alt="" />
    </>
  )
}

export default PomPage
