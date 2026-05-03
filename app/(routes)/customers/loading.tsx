export default function CustomersLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-8 w-36 bg-muted rounded" />
        <div className="h-8 w-32 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-background rounded-lg p-6 space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-8 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
