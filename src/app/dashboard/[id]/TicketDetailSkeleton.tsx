import TicketDetailShell from "./TicketDetailShell";

export default function TicketDetailSkeleton() {
  return (
    <TicketDetailShell>
      <p role="status" className="sr-only">Loading ticket…</p>
      <div aria-hidden="true" className="animate-pulse">
        <div className="mb-8 space-y-4">
          <div className="h-5 w-44 rounded bg-slate-200" />
          <div className="h-8 w-80 max-w-full rounded bg-slate-200" />
          <div className="h-4 w-52 rounded bg-slate-100" />
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-6 lg:min-h-72">
            <div className="mb-8 h-4 w-36 rounded bg-slate-100" />
            <div className="space-y-3">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-5/6 rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-40 rounded-xl border border-slate-200 bg-white" />
            <div className="h-72 rounded-xl border border-slate-200 bg-white" />
          </div>
        </div>
      </div>
    </TicketDetailShell>
  );
}
