import { useAccount, useConnectModal } from "@web3modal/react"
import { FC, useCallback, useMemo } from "react"
import styles from "../styles/HomePage.module.css"

export const ConnectButton: FC = () => {
  const { account } = useAccount()

  const { open } = useConnectModal()

  const { isConnected, isConnecting } = useMemo(() => account, [account])

  const hidden = useMemo(() => {
    if (isConnected === undefined) return true
    if (isConnecting) return true
    return isConnected
  }, [isConnected, isConnecting])

  const onClick = useCallback(() => {
    if (isConnected) return
    if (isConnecting) return
    open()
  }, [isConnected, isConnecting, open])

  return (
    <button className={styles.callToAction} hidden={hidden} onClick={onClick}>
      <span>Connect Wallet</span>
    </button>
  )
}
