import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import bs58 from 'bs58';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

function getMintKeypair(): Keypair {
  const privateKey = process.env.SOLANA_MINT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('SOLANA_MINT_PRIVATE_KEY environment variable is required');
  }
  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch (error) {
    throw new Error('Invalid SOLANA_MINT_PRIVATE_KEY format. Expected base58 encoded keypair.');
  }
}

export interface MintNFTParams {
  eventName: string;
  eventDescription?: string;
  eventImageUrl?: string;
  recipientAddress?: string;
}

export async function mintEventNFT(params: MintNFTParams): Promise<string> {
  try {
    const { recipientAddress } = params;
    
    const mintAuthority = getMintKeypair();

    const mint = await createMint(
      connection,
      mintAuthority, // payer
      mintAuthority.publicKey, // mint authority
      null, // freeze authority (null = no freeze)
      0, // decimals (0 for NFTs)
      undefined, // keypair (auto-generate)
      undefined, // confirmOptions
      TOKEN_PROGRAM_ID
    );

    const recipientPubkey = recipientAddress 
      ? new PublicKey(recipientAddress)
      : mintAuthority.publicKey;

    
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority, 
      mint,
      recipientPubkey 
    );

    await mintTo(
      connection,
      mintAuthority, 
      mint, 
      tokenAccount.address, 
      mintAuthority, 
      1 
    );

    return mint.toString();
  } catch (error) {
    console.error('Error minting NFT:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
    throw new Error('Failed to mint NFT: Unknown error');
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

