"use client";

import { Comment } from "./Dashboard";
import { timeAgo } from "../utils/timeUtils";

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="pb-6 last:pb-0">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 relative overflow-hidden rounded-full mr-3">
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-400 font-medium text-sm">
                  {comment.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium">
                {comment.author.username}
                <span className="text-xs text-gray-300 ml-2">
                  {timeAgo(comment.createdAt)}
                </span>
              </p>
            </div>
          </div>
          <p className="pl-11">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
