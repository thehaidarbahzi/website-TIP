import { CheckCircle } from "lucide-react";

export function SubmitSuccess({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10">
        <div className="w-24 h-24 bg-white/20 text-white border-2 border-white/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner backdrop-blur-md">
          <CheckCircle size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4 drop-shadow-md pb-1">
          {title}
        </h2>
        <div className="text-white/80 mb-6 max-w-md mx-auto text-lg leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
