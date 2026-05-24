import { useState } from "react";
import { WalletButton } from "./components/WalletButton";
import { NetworkGuard } from "./components/NetworkGuard";
import { MessageInput } from "./components/MessageInput";
import { MessageWall } from "./components/MessageWall";
import { StatsBar } from "./components/StatsBar";

export function App() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-24 px-4 md:px-8">
          <div />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center whitespace-nowrap">
            <span className="text-white">Gmonad</span>
            <span className="text-purple-400"> Wall</span>
          </h1>
          <div className="justify-self-end max-w-full">
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <NetworkGuard>
          {/* Post form */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Leave a message
            </h2>
            <MessageInput onPosted={() => setRefreshSignal((n) => n + 1)} />
          </section>

          {/* Stats */}
          <StatsBar />

          {/* Wall */}
          <MessageWall refreshSignal={refreshSignal} />
        </NetworkGuard>
      </main>
    </div>
  );
}
