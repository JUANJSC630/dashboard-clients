export function CalendarSkeleton() {
  return (
    <div className="md:flex gap-x-3 animate-pulse">
      <div className="w-[200px]">
        <div className="h-6 w-24 bg-muted rounded mb-3" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 mb-2 rounded-lg bg-muted h-16" />
        ))}
      </div>
      <div className="flex-1 bg-muted rounded-lg h-[80vh]" />
    </div>
  );
}
