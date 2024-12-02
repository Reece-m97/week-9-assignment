import { auth } from "@clerk/nextjs/server";
import { db } from "@/auth/db";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";

export default async function ProfilePage() {
  const { userId } = auth(); // Fetch the authenticated user ID from Clerk

  if (!userId) {
    // Handle unauthenticated state for server-rendered pages
    return (
      <SignedOut>
        <div className="p-4">
          <p>You need to sign in to view your profile.</p>
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign in here
          </Link>
        </div>
      </SignedOut>
    );
  }

  // Fetch user data and deeds from the database
  const userQuery = `
    SELECT  
      c_users.id,
      c_users.villain_name,
      c_users.backstory,
      c_users.notoriety_score,
      c_villain_levels.title
    FROM c_users
    JOIN c_villain_levels
    ON c_users.notoriety_score BETWEEN c_villain_levels.min_score AND c_villain_levels.max_score
    WHERE c_users.id = $1;
  `;
  const deedsQuery = `
    SELECT 
      c_deeds.id AS deed_id,
      c_deeds.description,
      c_deeds.category,
      c_deeds.date,
      COUNT(c_reactions.id) AS evil_laughs,
      COUNT(c_comments.id) AS comments_count
    FROM c_deeds
    LEFT JOIN c_reactions ON c_deeds.id = c_reactions.deed_id
    LEFT JOIN c_comments ON c_deeds.id = c_comments.deed_id
    WHERE c_deeds.user_id = $1
    GROUP BY c_deeds.id
    ORDER BY c_deeds.date DESC;
  `;

  const [userRes, deedsRes] = await Promise.all([
    db.query(userQuery, [userId]),
    db.query(deedsQuery, [userId]),
  ]);

  const user = userRes.rows[0];
  const deeds = deedsRes.rows;

  if (!user) {
    return <p>Profile not found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {user.villain_name}&apos;s Profile
      </h1>
      <p className="text-lg">
        <strong className="font-semibold">Title:</strong> {user.title}
      </p>
      <p className="mt-2 text-gray-700">
        <strong className="font-semibold">Backstory:</strong> {user.backstory}
      </p>
      <p className="mt-2 text-lg">
        <strong className="font-semibold">Notoriety Score:</strong>{" "}
        {user.notoriety_score}
      </p>

      <h2 className="mt-6 text-xl font-bold">Your Deeds</h2>
      <ul className="mt-4 space-y-4">
        {deeds.map((deed) => (
          <li key={deed.deed_id} className="p-4 border rounded-lg shadow">
            <p className="font-semibold">
              <strong>Description:</strong> {deed.description}
            </p>
            <p className="text-gray-600">
              <strong>Category:</strong> {deed.category}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong> {new Date(deed.date).toLocaleString()}
            </p>
            <p className="mt-2">
              <strong>Evil Laughs:</strong> {deed.evil_laughs} |{" "}
              <strong>Comments:</strong> {deed.comments_count}
            </p>
            <DeleteDeedButton deedId={deed.deed_id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeleteDeedButton({ deedId }) {
  async function deleteDeed() {
    "use server"; // Marks the function as a server action
    const query = `
      DELETE FROM c_deeds
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [deedId]);
    if (!rows.length) throw new Error("Failed to delete deed");
  }

  return (
    <form action={deleteDeed} method="POST">
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete
      </button>
    </form>
  );
}
