import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        404 - Villain Not Found
      </h1>
      <p className="text-lg text-gray-800 mb-6">
        No villain by this name exists in our database.
      </p>
      <p className="text-gray-600 mb-6">
        Perhaps they’ve gone into hiding or, dare we say, been defeated by a
        hero. 🦸‍♂️
      </p>
      <p className="text-gray-600 mb-6">
        Double-check your spelling, or maybe try searching for another evil
        mastermind.
      </p>
      <Link
        href="/villains"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Villain List
      </Link>
    </div>
  );
}
