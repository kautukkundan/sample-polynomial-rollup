## How to run

### Contracts

1. `cd contracts`
2. `yarn`
3. `npx hardhat compile`
4. `npx hardhat node`
5. new terminal `npx hardhat run scripts/deploy.ts --network localhost`

### Aggregator

1. `cd minimal-aggregator`
2. `yarn`
3. `yarn start`

### Frontend

1. `cd frontend`
2. `yarn`
3. `yarn start`
4. open browser
5. click connect button
6. set x and y value
7. click send and sign transaction

---

## How it works

1. the app takes value for x and y and creates a message
2. user then signs over the message and the message is sent to aggregator
3. aggregator waits for 5 transactions and then submits the batch on-chain
