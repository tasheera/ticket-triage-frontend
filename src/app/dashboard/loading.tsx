export default function Loading() {
  return (
    <main aria-busy="true" className="min-h-screen bg-slate-50/70">
      <p role="status" className="sr-only">Loading support inbox…</p>
      <div className="h-17 border-b border-slate-200 bg-white" />
      <div aria-hidden="true" className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10 lg:px-10">
        <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="h-30 border-b border-slate-100" />
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="border-b border-slate-100 px-6 py-5">
              <div className="h-3.5 w-2/5 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-3 w-1/4 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
          <div className="h-19" />
        </div>
      </div>
    </main>
  );
}
