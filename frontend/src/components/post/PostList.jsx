import PostCard from "./PostCard";
import Pagination from "../common/Pagination";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import { Link } from "react-router-dom";
import Button from "../common/Button";

/**
 * PostList Component
 * Renders a list of PostCards with pagination
 * Handles loading, empty and error states
 * @param {Array} posts - Array of post objects
 * @param {boolean} loading - Loading state
 * @param {object} pagination - Pagination metadata
 * @param {Function} onPageChange - Page change handler
 * @param {boolean} showActions - Pass to PostCard for dashboard view
 * @param {Function} onDelete - Pass to PostCard
 * @param {Function} onStatusChange - Pass to PostCard
 * @param {string} emptyMessage - Custom empty state message
 */
const PostList = ({
  posts = [],
  loading = false,
  pagination,
  onPageChange,
  showActions = false,
  onDelete,
  onStatusChange,
  emptyMessage = "No posts found",
}) => {
  /** Show spinner while loading */
  if (loading) {
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  /** Show empty state when no posts */
  if (!posts.length) {
    return (
      <EmptyState
        icon="📭"
        title="No posts yet"
        message={emptyMessage}
        action={
          showActions && (
            <Link to="/dashboard/create-post">
              <Button variant="primary" size="md">
                Create First Post
              </Button>
            </Link>
          )
        }
      />
    );
  }

  return (
    <div>
      {/** Post cards grid */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            showActions={showActions}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/** Pagination controls */}
      {pagination && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default PostList;
