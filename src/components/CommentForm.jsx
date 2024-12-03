import { auth } from "@clerk/nextjs/server";
import { db } from "@/auth/db";
import { revalidatePath } from "next/cache";

export default async function CommentForm({ deedId }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  async function handleSubmit(formData) {
    "use server";

    const comment = formData.get("comment");
    if (!comment) throw new Error("Comment cannot be empty");

    // Insert comment into the database
    await db.query(
      `INSERT INTO c_comments (deed_id, clerk_id, comment) VALUES ($1, $2, $3)`,
      [deedId, userId, comment]
    );

    // Revalidate the path to update comments dynamically
    revalidatePath(`/deeds/${deedId}`);
  }

  return (
    <form action={handleSubmit} className="mt-4 space-y-4">
      <textarea
        name="comment"
        placeholder="Add your comment..."
        required
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
}
