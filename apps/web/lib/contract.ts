import { ProofNestABI } from "@/lib/ProofNest";
import { toastError } from "@/utils/notifi";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

declare global {
    interface Window {
        ethereum?: any;
    }
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const PROOF_NEST_ABI = ProofNestABI.abi;

export const publicClient = createPublicClient({
    chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
})

export const getWalletClient = async()=>{
    if(typeof window !== 'undefined' && window.ethereum){
        const client = createWalletClient({
            chain: sepolia,
            transport: custom(window.ethereum)
        });
        return client;
    }
    toastError(3000,"Please install Metamask!");
    throw new Error("Please install Metamask!");
}

export const getPlanPrice = async(planId: number, isAnnual: boolean )=>{
    try{
        const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: PROOF_NEST_ABI,
            functionName: 'getPrice',
            args: [BigInt(planId), isAnnual]
        });
        return data as bigint;
    }catch(error){
        toastError(3000 ,(error as any)?.message || "Error fetching price");
        console.error("Error fetching price:", error);
        return BigInt(0);
    }
}

export const subscribeToPlan = async(planId:number, isAnnual:boolean, priceInWei: bigint)=>{
    const wallet = await getWalletClient();
    const [account] = await wallet.requestAddresses();

    const hash = await wallet.writeContract({
        address: CONTRACT_ADDRESS,
        abi: PROOF_NEST_ABI,
        functionName: 'subscribe',
        args: [BigInt(planId), isAnnual],
        account: account,
        value: priceInWei
    });
    return hash;
}

export const createProofOnChain = async (contentHash: string)=>{
    try{
        const wallet = await getWalletClient();
        const [account] = await wallet.requestAddresses();

        const formattedHash = contentHash.startsWith('0x') ? contentHash : `0x${contentHash}`;

        const hash = await wallet.writeContract({
            address: CONTRACT_ADDRESS,
            abi: PROOF_NEST_ABI,
            functionName: 'addProof',
            args: [formattedHash as `0x${string}`],
            account: account
        });

        return hash;
    }catch(error){
        toastError(3000 ,(error as any)?.message || "Error creating proof");
        console.error("Error creating proof:", error);
        return null;
    }
}