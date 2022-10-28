# POM frontend

## Requirements

Follow the instructions below to run server locally.

### Node.js

Install [Node.js](https://nodejs.org/) `v16` or later.

### Package dependencies

Install package depencencies: with [npm](https://www.npmjs.com/) do

```sh
npm install
```

### WalletConnect

Create a [WalletConnect](https://walletconnect.com/) project: sign in to your [WalletConnect Dashboard](https://cloud.walletconnect.com/), create a project and copy the *project ID*. Then use it for the `WALLETCONNECT_PROJECTID` environment variable.

### Environment variables

Create a *.env.local* file in this folder with a content like the following

```
WALLETCONNECT_PROJECTID=xxx
```

### Start local server

Run local server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

