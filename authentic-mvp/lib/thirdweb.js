import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const provider = getDefaultProvider(process.env.NEXT_PUBLIC_AMOY_RPC);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// Pass secretKey to SDK
export const sdk = new ThirdwebSDK(wallet, {
    secretKey: process.env.THIRDWEB_SECRET_KEY,
});
