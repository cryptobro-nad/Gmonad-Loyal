import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { monadTestnet } from "../wagmiConfig";

interface Props {
  children: React.ReactNode;
}

export function NetworkGuard({ children }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

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
          onClick={() => switchChain({ chainId: monadTestnet.id })}
          disabled={isPending}
          className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? "Switching…" : "Switch Network"}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
