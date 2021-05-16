import { Config } from './src/client/config';
import config from './config.test.json';
import { ProgramClient } from './src/client/programClient';
import { Keypair, PublicKey } from '@solana/web3.js';
import base58 from 'bs58';

// const seed = 
// const payer = Keypair.fromSeed(seed);


(async () => {
    
    const keypair = Keypair.generate();
    const secretKeyBase58 = base58.encode(keypair.secretKey);

    console.log('- address:', keypair.publicKey.toBase58());
    console.log('- secretKey:', secretKeyBase58);
})();