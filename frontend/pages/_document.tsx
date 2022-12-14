import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          // Emoji as favicon trick: https://css-tricks.com/emoji-as-a-favicon/
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥩</text></svg>"
          type="image/svg+xml"
        />

        <link rel="preconnect" href="https://rsms.me" crossOrigin="" />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
