import { useAccount } from "@web3modal/react"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { ConnectButton, Logo } from "_components"
import { useEmojis } from "../../hooks/useEmojis"
import { usePusher } from "../../hooks/usePusher"
import imageStyles from "../../styles/image.module.css"
import styles from "../../styles/ConnectPage.module.css"

const ConnectPage = () => {
  const router = useRouter()
  const { channelName } = router.query

  const { account } = useAccount()

  const [emojiKey, setEmojiKey] = useState()

  const { emoji } = useEmojis()

  const { pushMessage } = usePusher(channelName)

  const emojiList = useMemo(
    () =>
      Object.keys(emoji).map((key) => ({
        key,
        onClick: () => {
          setEmojiKey(key)
        },
      })),
    [emoji, setEmojiKey]
  )

  useEffect(() => {
    if (!channelName) return
    pushMessage({ eventName: "connected", message: "ok" })
  }, [channelName, pushMessage])

  useEffect(() => {
    if (!channelName) return
    if (!emojiKey) return
    pushMessage({ eventName: "emoji", message: emojiKey })
  }, [channelName, pushMessage, emojiKey])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo />
          <span className={styles.title}>Proof of Meet</span>
        </div>
        <div className={styles.hero}>
          <div className={styles.heroMessages}>
            <p className={styles.heroText}>
              Meet, connect, and prove who you’ve met
            </p>
            <p className={styles.heroSubText}>
              Proof of Meet is a social dapp to easily mint shared moments
              on-chain and show off your connections to the world
            </p>
          </div>
          <div className={styles.actionContainerTop}></div>
        </div>

        <div className={styles.actionContainer}>
          {!account.isConnected && (
            <>
              <p className={styles.actionText}>Connect and mint you who meet</p>
              <p className={styles.actionSubText}>
                Connect your wallet to proceed
              </p>
            </>
          )}
          <ConnectButton />

          {account.isConnected && (
            <>
              <div className={styles.emojiList}>
                {emojiList.map(({ key, onClick }) => (
                  <div key={key} className={styles.emoji} onClick={onClick}>
                    {emoji[key]}
                  </div>
                ))}
              </div>
              <p className={styles.actionText}>Click the correct emoji</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ConnectPage
