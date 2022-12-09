import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";

export function Game() {
  const [x, setX] = useState<number | null>(null);
  const [y, setY] = useState<number | null>(null);

  const { data: signer } = useSigner();

  const handleSubmit = async () => {
    if (x !== null && y !== null) {
      // retrieve message to be signed
      const message = ethers.utils.solidityPack(["uint", "uint"], [x, y]);

      // create signature
      const sig = await signer?.signMessage(message);

      // submit data to sequencer
      axios.post("http://localhost:3001/tx", {
        data: {
          data: message,
          signature: sig,
        },
      });
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="">enter a point that lie on the line</div>
        <div className="">
          <pre>
            y = x<sup>2</sup> -5x + 6
          </pre>
        </div>
      </div>

      <div className="game-inputs">
        <input
          placeholder="enter val x"
          onChange={(e) => setX(Number(e.target.value))}
        ></input>
        <input
          placeholder="enter val y"
          onChange={(e) => {
            setY(Number(e.target.value));
          }}
        ></input>
        <button className="game-submit" onClick={handleSubmit}>
          Set value
        </button>
      </div>
    </div>
  );
}
