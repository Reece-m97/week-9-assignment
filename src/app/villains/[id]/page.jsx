import { auth } from "@clerk/nextjs/server";
import { db } from "@/auth/db";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";

export default async function SingleProfilePage({ params }) {
  const { id } = await params;

  const { user, deeds } = await fetchUserAndDeeds(id);

  if (!user) {
    return <p>User not found.</p>;
  }

  // Fetch user data and deeds from the database
  async function fetchUserAndDeeds(userId) {
    // Query to fetch user details
    const userQuery = `
      SELECT  
        *
      FROM c_users
      WHERE c_users.id = $1;  
    `;

    // Query to fetch deeds for the user
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
      WHERE c_deeds.clerk_id = (SELECT clerk_id FROM c_users WHERE id = $1)
      GROUP BY c_deeds.id
      ORDER BY c_deeds.date DESC;
    `;

    const [userRes, deedsRes] = await Promise.all([
      db.query(userQuery, [userId]),
      db.query(deedsQuery, [userId]),
    ]);

    console.log("User response:", userRes);
    console.log("Deeds response:", deedsRes);

    const user = userRes.rows[0];
    const deeds = deedsRes.rows;

    return { user, deeds };
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
        {deeds.length === 0 ? (
          <li>No deeds found for this user.</li>
        ) : (
          deeds.map((deed) => (
            <li key={deed.deed_id} className="p-4 border rounded-lg shadow">
              <Link href={`/deeds/${deed.deed_id}`}>
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
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
