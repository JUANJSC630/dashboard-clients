export default function CompaniesLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-8 w-32 bg-muted rounded" />
      </div>
      <div className="p-4 rounded-lg shadow-md bg-background">
        <div className="h-9 w-64 bg-muted rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
