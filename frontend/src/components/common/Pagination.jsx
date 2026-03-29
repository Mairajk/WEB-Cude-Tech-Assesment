import Button from "./Button";

/**
 * Pagination Component
 * Displays page navigation controls
 * @param {object} pagination - { currentPage, totalPages, hasNext, hasPrev }
 * @param {Function} onPageChange - Callback with new page number
 */
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  /**
   * Generate array of page numbers to display
   * Shows max 5 pages with ellipsis for large page counts
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
      >
        ← Prev
      </Button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-8 h-8 rounded-lg text-sm font-medium transition-colors
            ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          {page}
        </button>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next →
      </Button>
    </div>
  );
};

export default Pagination;
