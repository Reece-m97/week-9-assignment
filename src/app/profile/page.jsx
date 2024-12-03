import { auth } from "@clerk/nextjs/server";
import { db } from "@/auth/db";
import Link from "next/link";
import DeleteDeedButton from "@/components/DeleteDeedButton";

export default async function ProfilePage() {
  const { userId } = await auth(); // Fetch the authenticated user ID from Clerk
  console.log(userId);

  // Fetch user data and deeds from the database
  const userQuery = `
    SELECT  
      *
    FROM c_users
    WHERE c_users.clerk_id = $1;  
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
    WHERE c_deeds.clerk_id = $1  
    GROUP BY c_deeds.id
    ORDER BY c_deeds.date DESC;
  `;

  try {
    // Log userId for debugging
    console.log("Fetching data for userId:", userId);

    const [userRes, deedsRes] = await Promise.all([
      db.query(userQuery, [userId]),
      db.query(deedsQuery, [userId]),
    ]);

    console.log("User response:", userRes);
    console.log("Deeds response:", deedsRes);

    const user = userRes.rows[0];
    const deeds = deedsRes.rows;

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
                    <strong>Date:</strong>{" "}
                    {new Date(deed.date).toLocaleString()}
                  </p>
                  <p className="mt-2">
                    <strong>Evil Laughs:</strong> {deed.evil_laughs} |{" "}
                    <strong>Comments:</strong> {deed.comments_count}
                  </p>
                </Link>
                <DeleteDeedButton deedId={deed.deed_id} />
              </li>
            ))
          )}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error fetching profile or deeds:", error);
    return (
      <p>There was an error loading your profile. Please try again later.</p>
    );
  }
}
