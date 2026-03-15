import { getInsights } from "@/lib/markdown";
import InsightCard from "@/components/InsightCard";

export default function Home() {
  const insights = getInsights();

  return (
    <div className="min-h-screen bg-[#0a0f12] text-white selection:bg-emerald-500/30 font-sans pb-32">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen mix-blend-color-dodge animate-pulse duration-10000" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen mix-blend-color-dodge" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-24 md:pt-32">
        <header className="mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Archive
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
            Self Journal
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
            A beautiful, auto-updating archive of daily insights and reflections captured by Limitless.
          </p>
        </header>

        {insights.length > 0 ? (
          <div className="space-y-12">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl">
            <p className="text-neutral-400 text-lg">No insights found yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
