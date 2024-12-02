import { db } from "@/auth/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function DeedForm() {
  const { userId } = await auth();
  async function handleDeedSubmit(formData) {
    "use server";

    const description = formData.get("description");
    const category = formData.get("category");

    if (!description || !category) throw new Error("Invalid input data");

    const query = `
      INSERT INTO  c_deeds (clerk_id, description, category)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [userId, description, category];
    await db.query(query, values);

    revalidatePath("/deeds");
  }
  return (
    <form action={handleDeedSubmit} className="mb-6">
      <textarea
        name="description"
        placeholder="Describe your villainous deed"
        required
        className="w-full p-2 border rounded mb-4"
      />
      <select
        name="category"
        required
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select a category</option>
        <option value="Petty deeds">Petty deeds</option>
        <option value="Moderate mischief">Moderate mischief</option>
        <option value="Diabolical schemes">Diabolical schemes</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit Deed
      </button>
    </form>
  );
}
