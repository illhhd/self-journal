"use client";

import { useState, useMemo } from "react";
import { Insight } from "@/lib/markdown";
import { format, parseISO } from "date-fns";
import { Calendar, Search, Tag, SidebarOpen, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import clsx from "clsx";

function InsightCard({ insight }: { insight: Insight }) {
  const [expanded, setExpanded] = useState(false);
  
  // Safe HTML parsing
  const htmlContent = marked.parse(insight.content) as string;

  return (
    <motion.article 
      layout
      className={clsx(
        "group relative rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 overflow-hidden mb-6 break-inside-avoid",
        expanded ? "shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/50" : "hover:bg-white/10 hover:shadow-xl hover:shadow-white/5"
      )}
    >
      <div className="absolute -inset-1 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 blur-2xl rounded-[100px] pointer-events-none -z-10" />
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2 text-emerald-400">
            <Calendar className="w-4 h-4" />
            <h2 className="text-sm md:text-base font-semibold tracking-wide">
              {format(new Date(insight.dateObj), "MMMM d, yyyy")}
            </h2>
          </div>
          
          {insight.tags && insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {insight.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="relative">
          <motion.div 
            layout
            initial={false}
            animate={{ height: expanded ? "auto" : "150px" }}
            className={clsx(
              "prose prose-sm md:prose-base prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-headings:font-medium prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-emerald-500",
              !expanded && "overflow-hidden mask-image-bottom"
            )}
            style={!expanded ? { WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" } : undefined}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-400/70 hover:text-emerald-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          {expanded ? (
            <>Collapse <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read Full Entry <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </motion.article>
  );
}

export default function ClientPage({ insights }: { insights: Insight[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string | "All">("All");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Derive unique months for the sidebar
  const months = useMemo(() => {
    const map = new Map<string, number>();
    insights.forEach(insight => {
      const monthStr = format(new Date(insight.dateObj), "yyyy-MM");
      map.set(monthStr, (map.get(monthStr) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [insights]);

  // Filter insights
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      const matchesSearch = insight.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            insight.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesMonth = selectedMonth === "All" || format(new Date(insight.dateObj), "yyyy-MM") === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [insights, searchQuery, selectedMonth]);

  return (
    <div className="flex min-h-screen bg-[#0a0f12] text-white selection:bg-emerald-500/30 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Month Navigation) */}
      <motion.aside 
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80 bg-[#0e151a]/95 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col h-full lg:transform-none transition-transform duration-300 ease-in-out"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
            Self Journal
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-neutral-400 hover:text-white bg-white/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-2">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 mt-2">Archives</p>
          
          <button
            onClick={() => { setSelectedMonth("All"); setSidebarOpen(false); }}
            className={clsx(
              "w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium flex items-center justify-between",
              selectedMonth === "All" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
            )}
          >
            <span>Everything</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{insights.length}</span>
          </button>

          {months.map(([monthStr, count]) => {
            const date = parseISO(`${monthStr}-01`);
            const isActive = selectedMonth === monthStr;
            return (
              <button
                key={monthStr}
                onClick={() => { setSelectedMonth(monthStr); setSidebarOpen(false); }}
                className={clsx(
                  "w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium flex items-center justify-between",
                  isActive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                )}
              >
                <span>{format(date, "MMMM yyyy")}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative z-10 w-full overflow-hidden">
        
        {/* Sticky Header with Search */}
        <header className="sticky top-0 z-30 p-4 md:p-6 lg:p-8 flex items-center gap-4 bg-gradient-to-b from-[#0a0f12] via-[#0a0f12]/90 to-transparent backdrop-blur-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-emerald-400"
          >
            <SidebarOpen className="w-5 h-5" />
          </button>
          
          <div className="relative flex-1 max-w-2xl mx-auto lg:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search insights by keyword, emotion, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-sm md:text-base text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-inner"
            />
          </div>
        </header>

        {/* Scrollable Masonry Grid */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-32">
          {filteredInsights.length > 0 ? (
            <motion.div layout className="columns-1 md:columns-2 xl:columns-3 gap-6 pt-4">
              <AnimatePresence>
                {filteredInsights.map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
            </AnimatePresence>
            </motion.div>
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center text-center p-12 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl max-w-lg mx-auto">
              <div className="w-16 h-16 mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No entries found</h3>
              <p className="text-neutral-400">Try adjusting your search query or selecting a different month from the sidebar.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
