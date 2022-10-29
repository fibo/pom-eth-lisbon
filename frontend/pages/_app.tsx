import { Web3Modal } from "@web3modal/react"
import type { ConfigOptions as Web3ModalConfig } from "@web3modal/core"
import type { AppProps } from "next/app"
import "../styles/globals.css"

const WALLETCONNECT_PROJECTID = process.env
  .NEXT_PUBLIC_WALLETCONNECT_PROJECTID as string

const web3modalConfig: Web3ModalConfig = {
  projectId: WALLETCONNECT_PROJECTID,
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
