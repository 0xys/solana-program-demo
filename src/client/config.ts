import { PublicKey, Keypair} from "@solana/web3.js";
import base58 from 'bs58';

export interface Config {
    payerKeypair: Keypair,
    programId: PublicKey,
    endpoint: string,
    programSeed: string,
    programDataSize: number
};

export const parse = (json: any): Config => {
    const payerSecretKey = base58.decode(json.payerSecretKey);
    return {
        endpoint: json.endpoint,
        payerKeypair: Keypair.fromSecretKey(Uint8Array.from(payerSecretKey)),
        programId: new PublicKey(json.programId),
        programSeed: json.programSeed,
        programDataSize: parseInt(json.programDataSize)
    };
}