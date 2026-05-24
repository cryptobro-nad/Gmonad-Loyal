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
        <div className="relative h-20 md:h-24 flex items-center justify-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center">
            <span className="text-white">Gmonad</span>
            <span className="text-purple-400"> Wall</span>
          </h1>
          <div className="absolute right-4 md:right-6 top-4 md:top-5">
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
