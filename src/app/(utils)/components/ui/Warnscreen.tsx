import { Lock, LucideIcon } from "lucide-react";

export function Warnscreen({
  icon: Icon = Lock,
  title,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-entrance relative z-10">
      <div className="w-28 h-28 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner rotate-3">
        <Icon size={48} strokeWidth={2.5} />
      </div>
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 mb-4 drop-shadow-md pb-1">
        {title}
      </h1>
      <div className="text-white/80 max-w-lg text-lg leading-relaxed font-medium drop-shadow-sm">
        {children}
      </div>
    </div>
  );
}
