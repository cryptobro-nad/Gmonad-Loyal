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
      <div className="overflow-x-hidden">
        {/* Composer — narrow */}
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <NetworkGuard>
            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Leave your mark
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                Public on Monad testnet. Keep it short and fun.
              </p>
              <MessageInput onPosted={() => setRefreshSignal((n) => n + 1)} />
            </section>
          </NetworkGuard>
        </div>

        {/* Stats + wall — wide */}
        <div className="max-w-6xl mx-auto px-4 pb-10 pt-4 flex flex-col gap-4">
          <StatsBar />
          <MessageWall refreshSignal={refreshSignal} />
        </div>
      </div>
    </div>
  );
}
