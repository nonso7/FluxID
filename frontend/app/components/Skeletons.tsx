"use client";

export function ScoreSkeleton() {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg width="240" height="240" viewBox="0 0 240 240">
          <circle 
            cx="120" 
            cy="120" 
            r="100" 
            fill="none" 
            stroke="var(--border)" 
            strokeWidth="16" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse w-24 h-12 bg-var(--surface) rounded" />
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-var(--surface) rounded ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-6">
      <div className="animate-pulse h-6 w-32 bg-var(--surface) rounded mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="animate-pulse h-4 w-20 bg-var(--surface) rounded mb-2" />
            <div className="animate-pulse h-8 w-full bg-var(--surface) rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}