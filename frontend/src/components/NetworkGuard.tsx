import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { monadTestnet } from "../wagmiConfig";

const CHAIN_HEX = "0x" + monadTestnet.id.toString(16);

async function switchToMonad() {
  const provider = (window as any).ethereum;
  if (!provider) throw new Error("No wallet detected");

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_HEX }],
    });
  } catch (err: any) {
    // 4902 = chain not yet added to the wallet
    const code = err?.code ?? err?.data?.originalError?.code;
    if (code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_HEX,
            chainName: "Monad Testnet",
            rpcUrls: ["https://testnet-rpc.monad.xyz"],
            nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
            blockExplorerUrls: ["https://testnet.monadexplorer.com"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

interface Props {
  children: React.ReactNode;
}

export function NetworkGuard({ children }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSwitch() {
    setSwitching(true);
    setError(null);
    try {
      await switchToMonad();
    } catch (err: any) {
      setError(err.message ?? "Failed to switch network");
    } finally {
      setSwitching(false);
    }
  }

  if (!isConnected) return <>{children}</>;

  if (chainId !== monadTestnet.id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-gray-300 text-lg">
          Wrong network. Switch to{" "}
          <span className="text-purple-400 font-semibold">Monad Testnet</span>.
        </p>
        <button
          onClick={handleSwitch}
          disabled={switching}
          className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50"
        >
          {switching ? "Switching…" : "Switch to Monad Testnet"}
        </button>
        {error && <p className="text-red-400 text-sm max-w-xs">{error}</p>}
      </div>
    );
  }

  return <>{children}</>;
}
