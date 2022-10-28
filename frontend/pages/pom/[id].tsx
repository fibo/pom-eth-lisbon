import { useRouter } from "next/router"
import { ConnectButton } from "_components"

const PomPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <p>POM: {id}</p>
      <ConnectButton />
    </>
  )
}

export default PomPage
