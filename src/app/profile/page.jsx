import { auth } from "@clerk/nextjs/server";
import { db } from "@/auth/db";
import Link from "next/link";
import DeleteDeedButton from "@/components/DeleteDeedButton";
import { revalidatePath } from "next/cache";

// Update the backstory
export async function updateBackstoryAction(formData) {
  "use server";

  const userId = formData.get("userId");
  const backstory = formData.get("backstory");

  if (!userId || !backstory) {
    throw new Error("Missing userId or backstory");
  }

  try {
    await db.query(`UPDATE c_users SET backstory = $1 WHERE clerk_id = $2`, [
      backstory,
      userId,
    ]);
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating backstory:", error);
    throw new Error("Failed to update backstory");
  }
}

export default async function ProfilePage() {
  const { userId } = await auth();

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
    const [userRes, deedsRes] = await Promise.all([
      db.query(userQuery, [userId]),
      db.query(deedsQuery, [userId]),
    ]);

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
        <form action={updateBackstoryAction} method="post" className="mt-4">
          <input type="hidden" name="userId" value={userId} />
          <label
            htmlFor="backstory"
            className="block text-sm font-medium text-gray-700"
          >
            Add to Backstory
          </label>
          <textarea
            name="backstory"
            id="backstory"
            rows="4"
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Write a new chapter of your villainous tale..."
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Backstory
          </button>
        </form>
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
