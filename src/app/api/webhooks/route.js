import { Webhook } from "svix";
import { db } from "@/auth/db";

export async function POST(req) {
  const signingSecret = process.env.SIGNING_SECRET || "your-secret";

  // Get headers
  const svix_id = req.headers.get("svix-id") || "";
  const svix_timestamp = req.headers.get("svix-timestamp") || "";
  const svix_signature = req.headers.get("svix-signature") || "";

  // Get raw body
  const body = await req.text();

  const svix = new Webhook(signingSecret);

  let msg;

  // Verify the payload
  try {
    msg = svix.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Bad Request", { status: 400 });
  }

  console.log("Webhook verified:", msg);

  // Extract id and username
  const { id, username } = msg.data;

  if (!id || !username) {
    console.error("Missing id or username in webhook payload");
    return new Response("Bad Request: Missing required fields", {
      status: 400,
    });
  }

  try {
    // Insert into database
    const result = await db.query(
      `INSERT INTO c_users (clerk_id, villain_name)
       VALUES ($1, $2)
       RETURNING *;`,
      [id, username]
    );

    console.log("Inserted user into database:", result.rows[0]);
  } catch (err) {
    console.error("Database insertion failed:", err);
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
