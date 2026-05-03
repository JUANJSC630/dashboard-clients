export default function SitesLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-8 w-24 bg-muted rounded" />
        <div className="h-8 w-32 bg-muted rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-background rounded-lg border" />
        ))}
      </div>
    </div>
  );
}
