export function ReviewPreloader() {
  return (
    <div className="flex flex-col gap-1.5 px-3 py-3 border-b border-[#1e1e4a] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-2 w-20 rounded bg-[#1e1e4a]" />
        <div className="h-2 w-10 rounded bg-[#1e1e4a]" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-2 w-full rounded bg-[#1e1e4a]" />
        <div className="h-2 w-3/4 rounded bg-[#1e1e4a]" />
      </div>
    </div>
  );
}