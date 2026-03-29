/**
 * Format a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date e.g. "Jan 10, 2024"
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Truncate a string to a max length and add ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Max character length
 * @returns {string} - Truncated string
 */
export const truncateText = (str, maxLength = 150) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
};

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert comma-separated string to array of tags
 * Used in post form tag input
 * @param {string} tagsString - e.g. "react, javascript, css"
 * @returns {string[]} - e.g. ["react", "javascript", "css"]
 */
export const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
};

/**
 * Convert array of tags to comma-separated string
 * Used to populate tag input field when editing a post
 * @param {string[]} tagsArray
 * @returns {string}
 */
export const tagsToString = (tagsArray) => {
  if (!tagsArray || !tagsArray.length) return "";
  return tagsArray.join(", ");
};

/**
 * Calculate reading time estimate for a post
 * Based on average reading speed of 200 words per minute
 * @param {string} content - Post content
 * @returns {string} - e.g. "3 min read"
 */
export const readingTime = (content) => {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};
