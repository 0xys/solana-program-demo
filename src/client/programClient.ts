import { PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, Connection, TransactionInstruction } from "@solana/web3.js";
import * as borsh from 'borsh';


export class ProgramClient<InstructionStruct> {
    private connection: Connection;

    constructor(private endpoint: string,
        private programId: PublicKey,
        private programSeed: string,
        private programDataSize: number)
    {
        this.connection = new Connection(this.endpoint, 'confirmed');
    }

    getPubkeyOwnedByProgram = async (payerKeypair: Keypair): Promise<PublicKey> => {
        const derivedKey = await PublicKey.createWithSeed(
            payerKeypair.publicKey, this.programSeed, this.programId
        );
        const accountInfo = await this.connection.getAccountInfo(derivedKey);
        if(accountInfo === null){
            // newly create
            return await this.createFromPayer(payerKeypair, derivedKey);
        }
        return derivedKey;
    }

    private createFromPayer = async (payerKeypair: Keypair, derivedKey: PublicKey): Promise<PublicKey> => {
        const lamports = await this.connection.getMinimumBalanceForRentExemption(
            this.programDataSize,
          );
        
        const transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: payerKeypair.publicKey,
                basePubkey: payerKeypair.publicKey,
                seed: this.programSeed,
                newAccountPubkey: derivedKey,
                lamports,
                space: this.programDataSize,
                programId: this.programId,
            }),
        );
        
        await sendAndConfirmTransaction(this.connection, transaction, [payerKeypair]);
        return derivedKey;
    }

    createInstruction = (request: InstructionStruct, schema: borsh.Schema, keys: {pubkey: PublicKey, isSigner: boolean, isWritable: boolean}[]): TransactionInstruction => {
        const data = borsh.serialize(schema, request);
        return this.createRawInstruction(data, keys);
    }

    createRawInstruction = (data: Uint8Array, keys: {pubkey: PublicKey, isSigner: boolean, isWritable: boolean}[]): TransactionInstruction => {        
        const instruction = new TransactionInstruction({
            keys: keys,
            programId: this.programId,
            data: Buffer.from(data),
        });

        return instruction;
    }

    sendInstruction = async (payerKeypair: Keypair, instruction: TransactionInstruction): Promise<string> => {
        const res = await sendAndConfirmTransaction(
            this.connection,
            new Transaction().add(instruction),
            [payerKeypair],
        );
        return res;
    }
}