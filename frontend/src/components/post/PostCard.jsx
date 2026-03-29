import { Link } from "react-router-dom";
import PostStatusBadge from "./PostStatusBadge";
import Button from "../common/Button";
import { formatDate, readingTime, truncateText } from "../../utils/helpers";

/**
 * PostCard Component
 * Displays a single post in a card format
 * Used in both public blog and dashboard post lists
 * @param {object} post - Post data object
 * @param {boolean} showActions - Show edit/delete buttons (dashboard only)
 * @param {Function} onDelete - Delete handler
 * @param {Function} onStatusChange - Status toggle handler
 * @param {boolean} isDeleting - Loading state for delete
 */
const PostCard = ({
  post,
  showActions = false,
  onDelete,
  onStatusChange,
  isDeleting = false,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      {/** Card Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/blog/${post._id}`}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
        </div>

        {/** Show status badge in dashboard view */}
        {showActions && <PostStatusBadge status={post.status} />}
      </div>

      {/** Excerpt */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
        {truncateText(post.excerpt || post.content, 150)}
      </p>

      {/** Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{post.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/** Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {/** Author avatar and name */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xs">
                {post.author?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>{post.author?.name}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>•</span>
          <span>{readingTime(post.content)}</span>
        </div>

        {/** Dashboard action buttons */}
        {showActions && (
          <div className="flex items-center gap-2">
            {/** Toggle status button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onStatusChange(
                  post._id,
                  post.status === "published" ? "draft" : "published",
                )
              }
            >
              {post.status === "published" ? "Unpublish" : "Publish"}
            </Button>

            {/** Edit button */}
            <Link to={`/dashboard/edit-post/${post._id}`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>

            {/** Delete button */}
            <Button
              variant="danger"
              size="sm"
              loading={isDeleting}
              onClick={() => onDelete(post._id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
