import { useRouter } from "next/router"

const PomPage = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>POM: {id}</p>
}

export default PomPage
