import { useMessageCount } from "../hooks/useWall";

export function StatsBar() {
  const { data: count } = useMessageCount();

  return (
    <div className="flex items-center justify-between text-xs text-gray-500 px-1">
      <span>
        Total messages:{" "}
        <span className="text-purple-400 font-mono">
          {count !== undefined ? count.toString() : "—"}
        </span>
      </span>
      <span className="text-gray-600">Showing latest 25</span>
      <span>
        Network:{" "}
        <span className="text-purple-400">Monad Testnet</span>
      </span>
    </div>
  );
}
