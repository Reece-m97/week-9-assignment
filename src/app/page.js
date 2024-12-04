import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Villain Hub</h1>
        <p className="text-lg mb-6">
          Ready to log your most nefarious deeds and climb the leaderboard?
        </p>
        <SignedOut>
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Go to Login
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/deeds"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Go to Deeds
          </Link>
        </SignedIn>
      </div>
    </main>
  );
}
