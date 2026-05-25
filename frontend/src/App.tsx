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
        {/* Mobile: stacked */}
        <div className="flex flex-col items-center gap-2 py-3 md:hidden">
          <h1 className="text-4xl font-extrabold tracking-tight text-center whitespace-nowrap">
            <span className="text-white">Gmonad</span>
            <span className="text-purple-400"> Wall</span>
          </h1>
          <WalletButton />
        </div>
        {/* Desktop: centered title, button pinned right */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-24 px-4 md:px-8">
          <div />
          <h1 className="text-6xl font-extrabold tracking-tight text-center whitespace-nowrap">
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
        {/* Post form — gated: hidden and replaced with switch prompt on wrong network */}
        <NetworkGuard>
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Leave a message
            </h2>
            <MessageInput onPosted={() => setRefreshSignal((n) => n + 1)} />
          </section>
        </NetworkGuard>

        {/* Stats and wall always visible regardless of network */}
        <StatsBar />
        <MessageWall refreshSignal={refreshSignal} />
      </main>
    </div>
  );
}
