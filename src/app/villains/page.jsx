import { db } from "@/auth/db";
import Link from "next/link";

export default async function VillainsPage({ searchParams }) {
  const sortOrder = (await searchParams.sort) === "desc" ? "DESC" : "ASC";

  // Fetch deeds from the database
  const usersQuery = `
SELECT 
      c_users.id AS user_id,
      c_users.villain_name AS villain_name,
      c_users.backstory,
      COUNT(c_deeds.id) AS deeds_count
  FROM c_users
  LEFT JOIN c_deeds ON c_users.clerk_id = c_deeds.clerk_id
  GROUP BY c_users.id, c_users.villain_name
  ORDER BY c_users.villain_name ${sortOrder};
`;

  const { rows: users } = await db.query(usersQuery);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Villains</h1>

      {/* Sort Button */}
      <Link
        href={{
          pathname: "/villains",
          query: { sort: sortOrder === "DESC" ? "asc" : "desc" },
        }}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mb-6 inline-block"
      >
        Sort by name: {sortOrder === "DESC" ? "Z-A" : "A-Z"}
      </Link>

      {/* Search Form */}
      <form
        action="/villains/search"
        method="get"
        className="flex items-center space-x-2 mb-6"
      >
        <input
          type="text"
          name="villain"
          placeholder="Search for a villain..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* List of Villains */}
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.user_id} className="p-4 border rounded-lg shadow">
            <Link href={`/villains/${user.user_id}`}>
              <h3 className="font-semibold">{user.villain_name}</h3>
              <p className="mt-2 text-gray-700">
                <strong className="font-semibold">Backstory:</strong>{" "}
                {user.backstory}
              </p>
              <p>
                <strong>Deeds:</strong> {user.deeds_count}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
