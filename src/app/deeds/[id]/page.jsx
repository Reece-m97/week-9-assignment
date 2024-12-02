import CommentForm from "@/components/CommentForm";

import { db } from "@/auth/db";
import React from "react";

// Fetch deed data from the database
async function fetchDeedAndComments(deedId) {
  const deedQuery = `
    SELECT 
      c_deeds.id AS deed_id,
      c_deeds.description,
      c_deeds.category,
      c_deeds.date,
      c_users.villain_name AS villain_name,
      COUNT(c_reactions.id) AS evil_laughs,
      COUNT(c_comments.id) AS comments_count
    FROM c_deeds
    LEFT JOIN c_users ON c_deeds.user_id = c_users.id
    LEFT JOIN c_reactions ON c_deeds.id = c_reactions.deed_id
    LEFT JOIN c_comments ON c_deeds.id = c_comments.deed_id
    WHERE c_deeds.id = $1
    GROUP BY c_deeds.id, c_users.villain_name;
  `;
  const commentQuery = `
    SELECT c_comments.id, c_comments.comment, c_comments.date, c_users.villain_name AS commenter_name
    FROM c_comments
    LEFT JOIN c_users ON c_comments.user_id = c_users.id
    WHERE c_comments.deed_id = $1
    ORDER BY c_comments.date DESC;
  `;

  const [deedResult, commentsResult] = await Promise.all([
    db.query(deedQuery, [deedId]),
    db.query(commentQuery, [deedId]),
  ]);

  const deed = deedResult.rows[0];
  const comments = commentsResult.rows;

  return { deed, comments };
}

export default async function SingleDeedPage({ params }) {
  const { id } = await params;

  const { deed, comments } = await fetchDeedAndComments(id);

  if (!deed) {
    return <p>Deed not found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{deed.villain_name}&apos;s Deed</h1>
      <p className="mt-4">
        <strong className="font-semibold">Description:</strong>{" "}
        {deed.description}
      </p>
      <p className="text-gray-600">
        <strong className="font-semibold">Category:</strong> {deed.category}
      </p>
      <p className="text-sm text-gray-500">
        <strong className="font-semibold">Date:</strong>{" "}
        {new Date(deed.date).toLocaleString()}
      </p>
      <p className="mt-4">
        <strong className="font-semibold">Evil Laughs:</strong>{" "}
        {deed.evil_laughs} | <strong>Comments:</strong> {deed.comments_count}
      </p>

      <h2 className="mt-6 text-xl font-bold">Comments</h2>
      <CommentForm deedId={id} />
      <ul className="mt-4 space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="p-4 border rounded-lg shadow">
            <p>
              <strong>{comment.commenter_name}:</strong> {comment.comment}
            </p>
            <p className="text-sm text-gray-500">
              <em>{new Date(comment.date).toLocaleString()}</em>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
