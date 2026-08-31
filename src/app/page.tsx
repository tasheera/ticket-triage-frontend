import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Ticket Triage</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Submit a support ticket and get it automatically categorized and
        prioritized - no waiting on a human to read it first.
      </p>
      <Link
        href="/submit"
        className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Submit a ticket
      </Link>
    </main>
  );
}
