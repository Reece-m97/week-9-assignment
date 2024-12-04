"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { deleteDeed } from "./DeleteDeed";

export default function DeleteDeedButton({ deedId }) {
  async function handleDelete() {
    try {
      await deleteDeed(deedId);
      console.log(`Deed ${deedId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting deed:", error);
    }
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <AlertDialog.Content className="fixed z-50 max-w-sm p-6 bg-white rounded-md shadow-lg inset-x-0 mx-auto top-1/3">
          <AlertDialog.Title className="text-lg font-bold">
            Confirm Delete
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            Are you sure you want to delete this deed? This action cannot be
            undone.
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
