/**
 * EmptyState Component
 * Displayed when a list has no items to show
 * @param {string} title - Main heading
 * @param {string} message - Descriptive message
 * @param {ReactNode} action - Optional action button
 * @param {string} icon - Emoji icon to display
 */
const EmptyState = ({
  title = "Nothing here yet",
  message = "Get started by creating your first item.",
  action,
  icon = "📭",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-6">{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
