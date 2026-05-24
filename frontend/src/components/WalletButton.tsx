import { useAccount, useConnect, useDisconnect } from "wagmi";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-purple-300 font-mono">{truncate(address)}</span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-1.5 rounded-lg border border-purple-500 text-purple-300 text-sm hover:bg-purple-500/20 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const injectedConnector = connectors.find((c) => c.id === "injected");
  const wcConnector = connectors.find((c) => c.id === "walletConnect");

  return (
    <div className="flex items-center gap-2">
      {injectedConnector && (
        <button
          onClick={() => connect({ connector: injectedConnector })}
          className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
        >
          Connect Wallet
        </button>
      )}
      {wcConnector && (
        <button
          onClick={() => connect({ connector: wcConnector })}
          className="px-4 py-1.5 rounded-lg border border-purple-600 text-purple-300 text-sm hover:bg-purple-600/20 transition-colors"
        >
          WalletConnect
        </button>
      )}
    </div>
  );
}
