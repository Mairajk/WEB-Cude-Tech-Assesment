/**
 * ErrorMessage Component
 * Displays error messages in a consistent styled box
 * @param {string} message - Error message to display
 * @param {Function} onDismiss - Optional callback to dismiss error
 */
const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-red-500">⚠️</span>
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
