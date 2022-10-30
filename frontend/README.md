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

### Environment variables

Create a *.env.local* file in this folder with a content like the following.

```
NEXT_INFURA_PROJECTID=xxx
NEXT_INFURA_APISECRET=xxx
NEXT_INFURA_GATEWAY=pom-eth-lisbon
NEXT_WALLETCONNECT_PROJECTID=xxx
NEXT_PUBLIC_PUSHER_CLUSTER=xxx
NEXT_PUBLIC_PUSHER_KEY=xxx
PUSHER_APPID=xxx
PUSHER_SECRET=xxx
```

Read below how to get all the values you need.

#### WalletConnect

Create a [WalletConnect](https://walletconnect.com/) project: sign in to your [WalletConnect Dashboard](https://cloud.walletconnect.com/), create a project and copy the *project ID*. Then use it for the `NEXT_PUBLIC_WALLETCONNECT_PROJECTID` environment variable.

#### Infura

Create a new project on [Infura](https://infura.io/), choose *IPFS* as network. Create a dedicated Gateway. Get *project id* and *API key secret* and use these three info to populate environment variables

* `NEXT_PUBLIC_INFURA_PROJECTID`
* `NEXT_PUBLIC_INFURA_APISECRET`
* `NEXT_PUBLIC_INFURA_GATEWAY`

#### Pusher

Create a new API key on [Pusher](https://pusher.com/) and set the following environment variables accordingly.

* `NEXT_PUBLIC_PUSHER_CLUSTER`
* `NEXT_PUBLIC_PUSHER_KEY`
* `PUSHER_APPID`
* `PUSHER_SECRET`

### Start local server

Run local server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**NOTA BENE** In a native app we would use Bluetooth as a transport layer to send messages between POM participants. We are using WebSocket as a transport layer since we had only few time and created a webapp, but we found issues with certificates. These issue were hard to spot, they both happen with ceritificate provided by Vercel (online demo) and when we run the webapp locally since MetaMask or WalletConnect only connect wallet if there is a secure connection. See also WalletConnect issue opened: https://github.com/WalletConnect/web3modal/issues/664

To solve the issue, run the server with

```sh
node server.js
```

Then connect using local IP, for instance https://10.1.0.241:3000/

You will need to accept certificates.
