export default function StatusPagesLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-8 w-36 bg-muted rounded" />
        <div className="h-8 w-40 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-background rounded-lg p-6 space-y-3">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
