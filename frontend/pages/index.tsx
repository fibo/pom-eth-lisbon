import Link from "next/link"
import { Content } from "_components"

export default function HomePage() {
  return (
    <Content>
      <p>
        Hello, world!
        <br />
        Let’s meet 🥩
      </p>

      <Link href="/create">create</Link>
    </Content>
  )
}
