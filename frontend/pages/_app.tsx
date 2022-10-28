import { Web3Modal } from "@web3modal/react"
import type { ConfigOptions as Web3ModalConfig } from "@web3modal/core"
import type { AppProps } from "next/app"
import "../styles/globals.css"

const web3modalConfig: Web3ModalConfig = {
  projectId: "36b858dbfae75926d108c610e4873316",
  theme: "dark",
  accentColor: "default",
  ethereum: {
    appName: "POM",
  },
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Web3Modal config={web3modalConfig} />
    </>
  )
}
