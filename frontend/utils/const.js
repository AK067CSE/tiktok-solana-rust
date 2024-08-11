import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import tiktokIDL from './tiktok_clone.json'; // Ensure the file path is correct

// Define the Solana cluster endpoint
export const SOLANA_HOST = clusterApiUrl('devnet');

// Define the TikTok program ID
export const TIKTOK_PROGRAM_ID = new PublicKey("Gv6u5jaf362EgXuXvkM2DYPfkPtubEurDiaQPUhLLYr2");

// Export the TikTok IDL for use with Anchor
export const TIKTOK_IDL = tiktokIDL;
