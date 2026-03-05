interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div className={`container rounded-2xl border border-white/10 bg-black/60 px-8 py-10 backdrop-blur-md flex-1 ${className}`}>
      {children}
    </div>
  );
}
