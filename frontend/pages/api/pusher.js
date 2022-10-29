import Pusher from "pusher"

const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY
const PUSHER_APPID = process.env.PUSHER_APPID
const PUSHER_SECRET = process.env.PUSHER_SECRET

export default async function apiHandler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false })

    const input = req.body
    console.log("input", input)

    const { channelName, eventName, message } = JSON.parse(input)
    console.log(channelName, eventName, message)

    const pusher = new Pusher({
      appId: PUSHER_APPID,
      key: PUSHER_KEY,
      secret: PUSHER_SECRET,
      cluster: PUSHER_CLUSTER,
    })

    pusher.trigger(channelName, eventName, { message })

    res.status(200).json({ ok: true, channelName, eventName, message })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false })
  }
}
