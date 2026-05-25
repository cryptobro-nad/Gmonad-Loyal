export interface WallMessage {
  id: bigint;
  text: string;
  timestamp: bigint;
  hidden: boolean;
}

const ACCENTS = [
  { border: "border-purple-500/40", pin: "bg-purple-400", label: "text-purple-400" },
  { border: "border-pink-500/40",   pin: "bg-pink-400",   label: "text-pink-400"   },
  { border: "border-blue-500/40",   pin: "bg-blue-400",   label: "text-blue-400"   },
  { border: "border-emerald-500/40",pin: "bg-emerald-400",label: "text-emerald-400"},
  { border: "border-amber-500/40",  pin: "bg-amber-400",  label: "text-amber-400"  },
] as const;

const ROTATIONS = [
  "rotate-[-0.5deg]",
  "rotate-[0.3deg]",
  "rotate-[-0.3deg]",
  "rotate-[0.5deg]",
  "rotate-0",
] as const;

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
  isNewest?: boolean;
}

export function MessageCard({ message, isNewest }: Props) {
  const idx = Number(message.id) % ACCENTS.length;
  const accent = ACCENTS[idx];
  const rotation = ROTATIONS[Number(message.id) % ROTATIONS.length];

  return (
    <div
      className={`relative bg-gray-900 border ${accent.border} rounded-xl p-4 pt-5 flex flex-col gap-2 ${rotation} hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
    >
      {/* pin dot */}
      <span
        className={`absolute -top-2 left-5 w-3 h-3 rounded-full ${accent.pin} ring-2 ring-gray-950`}
      />

      {/* NEW badge */}
      {isNewest && (
        <span className="absolute -top-2.5 right-4 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-purple-600 text-white uppercase">
          NEW
        </span>
      )}

      <p className="text-gray-100 text-sm leading-relaxed break-words">{message.text}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={`font-mono ${accent.label}`}>
          Anon Monad #{message.id.toString()}
        </span>
        <span>{timeAgo(message.timestamp)}</span>
      </div>
    </div>
  );
}
