import { useState, useEffect } from "react";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import Spinner from "../common/Spinner";
import Pagination from "../common/Pagination";
import commentService from "../../services/commentService";

/**
 * CommentList Component
 * Manages fetching, displaying and adding comments for a post
 * totalComments tracks live count including newly added comments
 * @param {string} postId - ID of the post to show comments for
 */
const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await commentService.getComments(postId, {
          page,
          limit: 10,
        });
        setComments(response.data.comments);
        setPagination(response.data.pagination);

        /**
         * Sync total count from pagination metadata
         * This is the source of truth from the backend
         */
        setTotalComments(response.data.pagination.totalComments);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId, page]);

  /**
   * Handle new comment submission
   * Optimistically prepends comment and increments count
   * @param {object} data - { content }
   */
  const handleAddComment = async (data) => {
    try {
      setSubmitting(true);
      const response = await commentService.addComment(postId, data);
      const newComment = response.data.comment;

      /** Prepend new comment to top of list */
      setComments((prev) => [newComment, ...prev]);

      /**
       * Increment count immediately without refetching
       * Keeps UI in sync without extra API call
       */
      setTotalComments((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Comments ({totalComments})
      </h3>

      <div className="mb-8">
        <CommentForm onSubmit={handleAddComment} loading={submitting} />
      </div>

      {loading ? (
        <div className="py-8">
          <Spinner size="md" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl px-6 divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
};

export default CommentList;
