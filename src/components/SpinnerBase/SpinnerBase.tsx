export function SpinnerBase() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-5 w-5 rounded-full border-2 border-[#6c6cff] border-t-transparent animate-spin" />
    </div>
  );
}