import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-slate-50">

      <div className="mb-6 flex items-center justify-center rounded-full bg-pink-100 p-4">
        <img
          src="/icon.svg"
          alt="AI ticket"
          className="h-10 w-10"
        />
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
        AI Ticket Triage
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
        Submit a support ticket and watch an LLM classify it by category, priority, and sentiment - complete with a reasoning explanation.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link
          href="/submit"
          className="rounded-md bg-black px-6 py-3 text-white font-medium hover:bg-slate-800 transition-colors"
        >
          Submit a ticket
        </Link>

        <Link
          href="/login"
          className="rounded-md bg-white border border-slate-300 px-6 py-3 text-slate-900 font-medium hover:bg-slate-100 transition-colors"
        >
          Agent Login
        </Link>
      </div>

    </main>
  );
}