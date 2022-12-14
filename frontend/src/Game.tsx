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
      const message = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint", "uint"],
        [await signer?.getAddress(), x, y]
      );

      // create signature
      const sig = await signer?.signMessage(message);

      // submit data to sequencer
      await axios.post("http://localhost:4000/tx/", {
        message: message,
        signature: sig,
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
