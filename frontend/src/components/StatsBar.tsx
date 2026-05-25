import { useMessageCount } from "../hooks/useWall";

export function StatsBar() {
  const { data: count } = useMessageCount();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        {count !== undefined ? count.toString() : "—"} messages on-chain
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        Latest 25 shown
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Monad Testnet
      </span>
    </div>
  );
}
