import { useEffect } from "react";
import { useLatestMessages, useMessageCount } from "../hooks/useWall";
import { MessageCard, WallMessage } from "./MessageCard";

const FETCH_LIMIT = 50;

interface Props {
  refreshSignal: number;
}

export function MessageWall({ refreshSignal }: Props) {
  const { data, isLoading, isError, refetch } = useLatestMessages(FETCH_LIMIT);
  const { data: count } = useMessageCount();

  useEffect(() => {
    if (refreshSignal > 0) refetch();
  }, [refreshSignal, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="text-purple-400 animate-pulse">Loading messages…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-400 py-10">Failed to load messages.</p>
    );
  }

  const [ids, texts, timestamps, hiddenFlags] = data ?? [[], [], [], []];

  const messages: WallMessage[] = (ids as bigint[])
    .map((id, i) => ({
      id,
      text: (texts as string[])[i],
      timestamp: (timestamps as bigint[])[i],
      hidden: (hiddenFlags as boolean[])[i],
    }))
    .filter((m) => !m.hidden)
    .reverse();

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
        <span className="text-4xl">🫙</span>
        <p>No messages yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="text-lg font-bold text-white">Community Wall</h2>
        {count !== undefined && (
          <span className="text-xs text-gray-500">{count.toString()} wall posts</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {messages.map((msg, i) => (
          <MessageCard key={msg.id.toString()} message={msg} isNewest={i === 0} />
        ))}
      </div>
    </div>
  );
}
