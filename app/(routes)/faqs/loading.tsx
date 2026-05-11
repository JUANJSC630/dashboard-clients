export default function FaqsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-32 bg-muted rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-background rounded-lg p-6 space-y-2">
            <div className="h-5 w-3/4 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
