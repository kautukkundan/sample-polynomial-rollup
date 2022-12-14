import bodyParser from "body-parser";
import cors from "cors";
import { ethers } from "ethers";
import express, { Request, Response } from "express";
import { BATCH_SIZE, PRIVATE_KEY, ROLLUP_ADDRESS, RPC_URL } from "./constants";

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function main() {
  const txBuffer: string[][] = [[], []];

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  async function postDataOnChain(txBuffer: string[][]) {
    const abi = [
      "function submitBatch(bytes[] calldata _input, bytes[] calldata _signatures) external",
    ];
    const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, provider);
    console.log("sending batch on-chain");
    await contract.connect(wallet).submitBatch(txBuffer[0], txBuffer[1]);
  }

  app.post("/tx", async (req: Request, res: Response) => {
    const { message, signature } = req.body;

    txBuffer[0].push(message);
    txBuffer[1].push(signature);

    if (txBuffer[0].length === BATCH_SIZE) {
      await postDataOnChain(txBuffer);

      txBuffer[0] = [];
      txBuffer[1] = [];
    }

    res.send({ message: "received" });
  });

  app.listen(4000, () => {
    console.log(`App listening on port ${4000}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
