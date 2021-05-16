# Solana HelloCount Program
Run local solana ledger as descrived in https://github.com/solana-labs/example-helloworld

## Client
### Generate Keypair
```
npm test
```
You will see output like:
```
- address: QkNBCToSWRokCZoQJgfFZnyFkiRpBpnm61MbGvXnfmR
- secretKey: AEC6btp5G1bRN98WceDCAR1KuCYxSt11fYoxzncey863yYuqckVk6WnfDSTqJFyN6K3hRJKVc3buqHYmBtoDZ7u
```
Generated address will pay fee for program exexution. So, need to faucet the account in next section.
### Faucet generated address
```
solana airdrop 1000 <Generated_address>
```

## Solana Program
### Build
```
npm run build:program-rust
```
You will see output like:
```
Program Id: Cck9VUJZbfTJzaYkAKKMwGEgrXosZd2pQHba2t7haqkm
```
### Edit Config
`config.test.json`
```
{
    "endpoint": " http://127.0.0.1:8899",
    "payerSecretKey": "<Obtained from section 'Generate Keypair'>",
    "programId": "<Obtained from section 'Build'>",
    "programSeed": "MYSEED",
    "programDataSize": "9"
}
```
### Deploy
```
solana program deploy dist/program/hellocount.so
```
### Request Instruction to Program
```
npm start
```