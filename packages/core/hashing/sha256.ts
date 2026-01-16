import { SHA256 } from 'crypto-js';

/**
 * Generate SHA-256 Hash Code from Text Content
 * @param content 
 * @returns SHA-256 Hash Code
 */
export const generateContentHash = (content:string) =>{
   if(!content) return "";
   return SHA256(content).toString(); 
}

/**
 * Verify Content Hash
 * @param content 
 * @param hash 
 * @returns boolean
 */
export const verifyContent = (content:string, hash:string):boolean=>{
   const newHash = generateContentHash(content);
   return newHash === hash;
}

/**
 * Format Address
 * @param address 
 * @returns formatted address
 */
export const formatAddress = (address:string)=>{
    return `${address.substring(0,6)}...${address.substring(-4)}`;
}
