import Link from "next/link"
import { Content } from "_components"
import styles from "../styles/HomePage.module.css"

export default function HomePage() {
  return (
    <Content>
      <div className={styles.container}>
        <div className={styles.hero}>
          <p className={styles.heroText}>
            Meet, connect, and prove who you’ve met
          </p>
          <Link className={styles.callToAction} href="/create">
            <span>Create new Proof of Meet</span>
          </Link>
        </div>

        <footer className={styles.footer}>
          <h2>Proof of Meet</h2>
          <p>
            The world’s first web3 platform to show off who you’ve met in the
            offline world
          </p>
        </footer>
      </div>
    </Content>
  )
}
