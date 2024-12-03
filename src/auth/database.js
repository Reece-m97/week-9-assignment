import pg from "pg";

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function insertUser(clerkId, username) {
  try {
    const result = await db.query(
      `INSERT INTO c_users (clerk_id, username)
       VALUES ($1, $2)
       RETURNING *;`,
      [clerkId, username]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting user into the database:", err);
    throw new Error("Database insertion failed");
  }
}
