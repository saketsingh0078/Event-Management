import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const keypair = Keypair.generate();
const privateKey = bs58.encode(keypair.secretKey);

console.log('\n=== Solana Keypair Generated ===\n');
console.log('Public Key (Address):', keypair.publicKey.toString());
console.log('\nPrivate Key (base58):', privateKey);
console.log('\n=== Add to your .env file ===\n');
console.log(`SOLANA_MINT_PRIVATE_KEY=${privateKey}`);
console.log('\n⚠️  Keep this private key secure! Do not commit it to version control.\n');
console.log('💡 For devnet, you can fund this address at: https://faucet.solana.com/\n');

