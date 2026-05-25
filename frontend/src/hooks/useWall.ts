import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GmonadWallABI } from "../abi/GmonadWall";
import { CONTRACT_ADDRESS, monadTestnet } from "../wagmiConfig";

export function useMessageCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GmonadWallABI,
    functionName: "getMessageCount",
    chainId: monadTestnet.id,
  });
}

export function useLatestMessages(limit: number) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GmonadWallABI,
    functionName: "getLatestMessages",
    args: [BigInt(limit)],
    chainId: monadTestnet.id,
  });
}

export function useCooldownRemaining(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GmonadWallABI,
    functionName: "getCooldownRemaining",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 },
    chainId: monadTestnet.id,
  });
}

export function usePostMessage() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function post(text: string) {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: GmonadWallABI,
      functionName: "postMessage",
      args: [text],
      chainId: monadTestnet.id,
    });
  }

  return { post, hash, isPending, isConfirming, isSuccess, error };
}
