import { useAccount } from "@web3modal/react"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ConnectButton, Logo, Spinner } from "_components"
import { useEmojis } from "../../hooks/useEmojis"
import { usePusher } from "../../hooks/usePusher"
import styles from "../../styles/ConnectPage.module.css"

const ConnectPage = () => {
  const router = useRouter()
  const { channelName } = router.query

  const { account } = useAccount()

  const [emojiKey, setEmojiKey] = useState()
  const [hasImage, setHasImage] = useState(false)

  const { emoji } = useEmojis()

  const { channel, pushMessage } = usePusher(channelName)

  const emojiList = useMemo(
    () =>
      Object.keys(emoji).map((key) => ({
        key,
        selected: key === emojiKey,
        onClick: () => {
          setEmojiKey(key)
        },
      })),
    [emoji, emojiKey, setEmojiKey]
  )

  const onClickLogo = useCallback(() => {
    router.push("/")
  }, [router])

  useEffect(() => {
    if (!channelName) return
    pushMessage({ eventName: "connected", message: "ok" })
  }, [channelName, pushMessage])

  useEffect(() => {
    if (!channel) return
    channel.bind("image", () => {
      setHasImage(true)
    })
  }, [channel, setHasImage])

  useEffect(() => {
    if (!channelName) return
    if (!emojiKey) return
    pushMessage({ eventName: "emoji", message: emojiKey })
  }, [channelName, pushMessage, emojiKey])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo} onClick={onClickLogo}>
          <Logo />
          <span className={styles.title}>Proof of Meet</span>
        </div>
        <div className={styles.hero}>
          <div className={styles.heroMessages}>
            {account.isConnected ? null : (
              <>
                <p className={styles.heroText}>
                  Meet, connect, and prove who you’ve met
                </p>
                <p className={styles.heroSubText}>
                  Proof of Meet is a social dapp to easily mint shared moments
                  on-chain and show off your connections to the world
                </p>
              </>
            )}
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
            <div className={styles.connected}>
              {hasImage ? (
                <div className={styles.emojiList}>
                  {emojiList.map(({ key, onClick, selected }) => (
                    <div
                      key={key}
                      className={`${styles.emojiContainer} ${
                        selected ? styles.emojiSelected : ""
                      }`}
                      onClick={onClick}
                    >
                      <div className={styles.emoji}>{emoji[key]}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className={styles.actionText}>Connected!</p>
                  <p className={styles.actionSubText}>
                    Your profiles are now linked. Please leave your browser open
                    and your phone unlocked.
                  </p>

                  <Spinner />

                  <p className={styles.actionSubText}>
                    Your friend will take the selfie...
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ConnectPage
