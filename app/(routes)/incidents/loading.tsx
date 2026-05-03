export default function IncidentsLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <div className="h-8 w-28 bg-muted rounded" />
        <div className="h-4 w-56 bg-muted rounded mt-2" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-background rounded-lg p-4 border">
            <div className="h-8 w-8 bg-muted rounded mx-auto" />
            <div className="h-4 w-16 bg-muted rounded mx-auto mt-2" />
          </div>
        ))}
      </div>
      <div className="h-10 w-64 bg-muted rounded" />
      <div className="bg-background rounded-lg border overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b last:border-0">
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
