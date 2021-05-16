import { Config, parse } from './src/client/config';
import configRaw from './config.test.json';
import { ProgramClient } from './src/client/programClient';

const config: Config = parse(configRaw);

(async () => {
    console.log('payer address:', config.payerKeypair.publicKey.toBase58());
    console.log('program_id:', config.programId.toBase58());

    const client = new ProgramClient(config.endpoint,
        config.programId,
        config.programSeed,
        config.programDataSize);
    
    //  derive account key for the program.
    const derivedKey = await client.getPubkeyOwnedByProgram(config.payerKeypair);
    console.log('derived key:', derivedKey.toBase58());
    
    //  instruction construction
    const rawInstruction = Uint8Array.from([0, 1,0,0,0, 0,0,0,0]);
    const instruction = client.createRawInstruction(rawInstruction, [{pubkey: derivedKey, isSigner: false, isWritable: true}]);

    const sig = await client.sendInstruction(config.payerKeypair, instruction);
    console.log('transaction signature:', sig);
})();