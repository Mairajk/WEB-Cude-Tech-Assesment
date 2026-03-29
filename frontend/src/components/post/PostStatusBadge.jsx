/**
 * PostStatusBadge Component
 * Displays a colored badge based on post status
 * @param {string} status - 'draft' | 'published'
 */
const PostStatusBadge = ({ status }) => {
  const styles = {
    published: "bg-green-100 text-green-700 border border-green-200",
    draft: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  };

  const icons = {
    published: "🟢",
    draft: "🟡",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}
    >
      {icons[status]} {status}
    </span>
  );
};

export default PostStatusBadge;
