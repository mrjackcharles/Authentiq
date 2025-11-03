## Authentiq

### Tech stack

-   NextJS (Frontend)
-   Firebase (Backend)
-   Tailwind (styling)
-   Third Web (Smart contract)
-   Chainstack (RPC endpoint)
-   Polygon Amoy (test blockchain with deployed ERC721 contract)
    <br>
    <br>

### Features

-   Generates item with unique block-chain certificate
-   Image stored on a IPFS (decentralised)
    <br>
    <br>
    Version: 0.0.2
    <br>

---

© 2025 Jack Charles. All rights reserved.
<br>
<br>
<br>
<br>
<br>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

## Learn More

-   [Next.js Documentation](https://nextjs.org/docs)

## Firebase persistence

To permanently store minted items and their details (tokenId, serial, metadata) in Firestore, the API uses the Firebase Admin SDK.

1. Enable Firestore in your Firebase project.
2. Create a Service Account and generate a JSON key in Firebase/Google Cloud Console.
3. Add these to `.env.local`:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
# If your private key contains line breaks, keep it quoted; the code converts \n to newlines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

The mint API writes to the `mintedItems` collection using the `tokenId` as the document ID. See `lib/firebaseAdmin.js` and `pages/api/mint.js`.
