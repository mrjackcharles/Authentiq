// Server-side only SDK helper
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Wallet, getDefaultProvider } from "ethers";

export function getServerSdk() {
    const provider = getDefaultProvider(process.env.NEXT_PUBLIC_AMOY_RPC);
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

    return new ThirdwebSDK(wallet, {
        secretKey: process.env.THIRDWEB_SECRET_KEY,
    });
}
