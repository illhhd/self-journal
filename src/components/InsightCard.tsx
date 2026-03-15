import { Insight } from "@/lib/markdown";
import { marked } from "marked";
import { Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export default function InsightCard({ insight }: { insight: Insight }) {
  // Convert markdown to HTML safely using marked
  const htmlContent = marked.parse(insight.content) as string;

  return (
    <article className="group relative rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 blur-2xl rounded-[100px] pointer-events-none -z-10" />
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-emerald-400">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg md:text-xl font-medium tracking-wide">
              {format(insight.dateObj, "MMMM d, yyyy")}
            </h2>
          </div>
          
          {insight.tags && insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {insight.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div 
          className="prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-headings:font-medium prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-emerald-500"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </div>
    </article>
  );
}
