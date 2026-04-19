export function SkeletonCard() {
  return (
    <div className="bg-ink-700 border border-ink-600 rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-ink-600" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-ink-500 rounded w-1/3" />
        <div className="h-5 bg-ink-500 rounded w-3/4" />
        <div className="h-4 bg-ink-500 rounded w-full" />
        <div className="h-4 bg-ink-500 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
