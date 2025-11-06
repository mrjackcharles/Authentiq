## Authentiq

I always had the idea of wanting to use NFTs in a more powerful way than just cartoons. Using it's uniqueness and the massive increase in the forgery of high value products. I thought it would be a great idea to create an MVP web-app that allows a person to upload a product and assign it a unique NFT certificate therefore proving it's authenticity. Something that cannot be forged!

### Demo

See it live: [https://authentiq.uk](https://authentiq.uk)

---

### Tech stack

-   NextJS
-   Vanilla JavaScript
-   Firebase
-   Tailwind
-   Third Web (Smart contract (ERC721) managment)
-   Chainstack (Manages blockchain communication)
-   Polygon Amoy (Test blockchain)
-   AWS Amplify (Hosting)

---

### Features

-   Generates a unique certificate on the blockchain for your product
-   Images that are part of certificates are stored on a IPFS (decentralised)
-   User register and login
-   Dashboard to see all certificates created

---

## Installation

### Environment Variables

```
MINTING
PRIVATE_KEY= [ThirdWeb]
CONTRACT_ADDRESS= [ThirdWeb]
NEXT_PUBLIC_THIRDWEB_API_KEY=
THIRDWEB_SECRET_KEY=
NEXT_PUBLIC_AMOY_RPC= [Chainstack]

FIREBASE
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=""
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Local

Clone the repo:

```bash
git clone https://github.com/mrjackcharles/Authentiq.git
```

Make sure to be in the correct directory:

```
cd authentic-mvp
```

Install dependancies:

```
npm install
```

Run locally:

```
npm run dev
```

The development server runs at: http://localhost:3000

### Minting Setup

-   Polygon Amoy Testnet is the test blockchain managed in a Chainstack project
-   ThirdWeb manages the NFT smart contract (read, write, deploy)
-   A Polygon Amoy faucet is used to provide a Personal Metamask Account with a small amount of POL to be used as gas for testing NFT actions

### Firebase Setup

To permanently store minted items and their details (tokenId, serial, metadata) in Firestore, the API uses the Firebase Admin SDK.

1. Enable Firestore in your Firebase project.
2. Create a Service Account and generate a JSON key in Firebase/Google Cloud Console.
3. Add these to `.env.local`: (also included in env list above)

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="private-key"
```

The mint API writes to the `mintedItems` collection using the `tokenId` as the document ID. See `lib/firebaseAdmin.js` and `pages/api/mint.js`.

## Deployment

This application is currently hosted on AWS Amplify with a custom `amplify.yml` and domain

Version: 0.0.2

---

© 2025 Jack Charles. All rights reserved.
