import { db } from "@/auth/db";
import { notFound, redirect } from "next/navigation";

export default async function SearchPage({ searchParams }) {
  const villainName = await searchParams.villain?.trim();

  if (!villainName) {
    return notFound(); // Show a 404 page if no query
  }

  const query = `
SELECT id AS user_id 
FROM c_users 
WHERE LOWER(villain_name) = LOWER($1)
LIMIT 1;
`;

  const { rows } = await db.query(query, [villainName]);

  if (rows.length === 0) {
    return notFound(); // Show a 404 page if no villain found
  }

  const user = rows[0];

  // Redirect to the villain's page
  redirect(`/villains/${user.user_id}`);
}
