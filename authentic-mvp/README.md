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

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

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
