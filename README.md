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
npm run build:hello_count
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
npm run publish:hello_count
```
### Request Instruction to Program
```
npm start
```
#### logs in solana-log
```
Transaction executed in slot 71790:
  Signature: 4e9PXVmoM4Dkr64UPrc6DqHS3ZSAPUU4Z55Ux5BSWhSFEEcgEgN3oX3fpDzWjvSoha9vZyTWVf68ARRPjtvGXN9
  Status: Ok
  Log Messages:
    Program Cck9VUJZbfTJzaYkAKKMwGEgrXosZd2pQHba2t7haqkm invoke [1]
    Program log: Hello Count Rust program entrypoint
    Program log: instruction: [0, 1, 0, 0, 0, 0, 0, 0, 0]
    Program log: Instruction: HelloCount
    Program log: account state: [1, 2, 0, 0, 0, 0, 0, 0, 0]
    Program log: state update: 2 + 1 = 3
    Program Cck9VUJZbfTJzaYkAKKMwGEgrXosZd2pQHba2t7haqkm consumed 7382 of 200000 compute units
    Program Cck9VUJZbfTJzaYkAKKMwGEgrXosZd2pQHba2t7haqkm success
```
Account state is updated every time the program is executed.
In this case, 
- `instruction: [0, 1, 0, 0, 0, 0, 0, 0, 0]` means the request of incrementing account count by `1` (encoded in last 8 bytes of the array, which is `u64` little-endian) is received.
- `account state: [1, 2, 0, 0, 0, 0, 0, 0, 0]` means current count is `2` (encoded in last 8 bytes of the array, which is `u64` little-endian).
- `state update: 2 + 1 = 3` means count is updated from `2`, incremented by `1` and resulting in `3`.