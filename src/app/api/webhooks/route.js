import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/auth/db"; // Import the database instance

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  const { id: userId, username } = evt.data; // Extract userId and username from the payload
  const eventType = evt.type;

  console.log(
    `Received webhook with ID ${userId} and event type of ${eventType}`
  );
  console.log("Webhook payload:", body);

  if (eventType === "user.created") {
    try {
      const query = `INSERT INTO c_users (clerk_id, villain_name) VALUES ($1, $2)`;
      await db.query(query, [userId, username]); // Insert userId and username into the database
      console.log(`User created: ${username} (${userId})`);
    } catch (error) {
      console.error("Database insertion error:", error);
      return new Response("Error: Database error", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
