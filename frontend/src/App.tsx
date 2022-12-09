import { configureChains, chain, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { Game } from "./Game";
import { ConnectButton } from "./ConnectButton";

const { provider, webSocketProvider } = configureChains(
  [chain.localhost],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <div className="App">
        <ConnectButton />

        <Game />
      </div>
    </WagmiConfig>
  );
}

export default App;
