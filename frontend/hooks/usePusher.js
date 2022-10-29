import { useCallback, useEffect, useState } from "react"

const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY

export const usePusher = (channelName) => {
  const [channel, setChannel] = useState(null)

  useEffect(() => {
    if (!channelName) return
    if (channel) return
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    })
    const pusherChannel = pusher.subscribe(channelName)
    setChannel(pusherChannel)
  }, [channelName, setChannel, channel])

  const pushMessage = useCallback(
    ({ eventName, message }) => {
      const body = { message, eventName, channelName }

      fetch("/api/pusher", { method: "POST", body: JSON.stringify(body) })
    },
    [channelName]
  )

  return { channel, pushMessage }
}
