import Head from "next/head"
import React, { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const Content: FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>proof of meet</title>
        <meta name="description" content="Hello, world! Let’s meet 🥩" />
      </Head>

      <>{children}</>
    </>
  )
}
