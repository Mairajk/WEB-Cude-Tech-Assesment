import { formatDate } from "../../utils/helpers";

/**
 * CommentCard Component
 * Displays a single comment with author and date
 * @param {object} comment - Comment data object
 */
const CommentCard = ({ comment }) => {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {/** Author Avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
        <span className="text-blue-600 font-semibold text-sm">
          {comment.author?.name?.charAt(0).toUpperCase()}
        </span>
      </div>

      {/** Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-800">
            {comment.author?.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
