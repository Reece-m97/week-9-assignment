"use server";

import { db } from "@/auth/db";
import { revalidatePath } from "next/cache";

export async function deleteDeed(deedId) {
  try {
    const result = await db.query(
      `DELETE FROM c_deeds WHERE id = $1 RETURNING *`,
      [deedId]
    );
    console.log("Delete result:", result);
    revalidatePath("/profile");
    return result;
  } catch (error) {
    console.error("Failed to delete deed:", error);
  }
}
