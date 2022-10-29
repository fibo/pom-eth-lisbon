import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { ConnectButton } from "_components"
import { useEmojis } from "../../hooks/useEmojis"
import { usePusher } from "../../hooks/usePusher"
import imageStyles from "../../styles/image.module.css"
import styles from "../../styles/ConnectPage.module.css"

const ConnectPage = () => {
  const router = useRouter()
  const { channelName } = router.query

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
    if (!emojiKey) return
    pushMessage({ eventName: "emoji", message: emojiKey })
  }, [channelName, pushMessage, emojiKey])

  return (
    <>
      <p>Ask to see your connection code</p>
      <ConnectButton />

      <div className={styles.emojiList}>
        {emojiList.map(({ key, onClick }) => (
          <div key={key} className={styles.emoji} onClick={onClick}>
            {emoji[key]}
          </div>
        ))}
      </div>
    </>
  )
}

export default ConnectPage
