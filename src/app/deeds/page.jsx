import { db } from "@/auth/db";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import DeedForm from "@/components/DeedForm";

export default async function DeedLogPage({ searchParams }) {
  const sortOrder = (await searchParams.sort) === "asc" ? "ASC" : "DESC";

  // Fetch deeds from the database
  const deedsQuery = `
SELECT 
      c_deeds.id AS deed_id,
      c_deeds.description,
      c_deeds.category,
      c_deeds.date,
      c_users.villain_name AS villain_name,
      COUNT(c_reactions.id) AS evil_laughs,
      COUNT(c_comments.id) AS comments_count
  FROM c_deeds
  LEFT JOIN c_users ON c_deeds.clerk_id = c_users.clerk_id
  LEFT JOIN c_reactions ON c_deeds.id = c_reactions.deed_id
  LEFT JOIN c_comments ON c_deeds.id = c_comments.deed_id
  GROUP BY c_deeds.id, c_users.villain_name
  ORDER BY c_deeds.date ${sortOrder};
`;

  const { rows: deeds } = await db.query(deedsQuery);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Villainous Deeds</h1>

      <SignedIn>
        <DeedForm />{" "}
      </SignedIn>

      <SignedOut>
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Please sign in to make a post
        </Link>
      </SignedOut>

      <Link
        href={{
          pathname: "/deeds",
          query: { sort: sortOrder === "ASC" ? "desc" : "asc" },
        }}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-6 inline-block"
      >
        Sort Date: {sortOrder === "ASC" ? "Descending" : "Ascending"}
      </Link>

      <ul className="space-y-4">
        {deeds.map((deed) => (
          <li key={deed.deed_id} className="p-4 border rounded-lg shadow">
            <Link href={`/deeds/${deed.deed_id}`}>
              <h3 className="font-semibold">{deed.villain_name}</h3>
              <p>
                <strong>Description:</strong> {deed.description}
              </p>
              <p className="text-gray-600">
                <strong>Category:</strong> {deed.category}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {new Date(deed.date).toLocaleString()}
              </p>
              <p>
                <strong>Evil Laughs:</strong> {deed.evil_laughs} |{" "}
                <strong>Comments:</strong> {deed.comments_count}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
