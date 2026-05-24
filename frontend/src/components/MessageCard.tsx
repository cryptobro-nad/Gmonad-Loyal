export interface WallMessage {
  id: bigint;
  text: string;
  timestamp: bigint;
  hidden: boolean;
}

function timeAgo(unixSeconds: bigint) {
  const diff = Math.floor(Date.now() / 1000) - Number(unixSeconds);
  if (diff < 60) return "just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m} minute${m === 1 ? "" : "s"} ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const d = Math.floor(diff / 86400);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

interface Props {
  message: WallMessage;
}

export function MessageCard({ message }: Props) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-2">
      <p className="text-white text-sm leading-relaxed break-words">{message.text}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="text-purple-400 font-mono">
          Anon Monad #{message.id.toString()}
        </span>
        <span>{timeAgo(message.timestamp)}</span>
      </div>
    </div>
  );
}
