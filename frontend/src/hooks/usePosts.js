import { useContext } from "react";
import { PostContext } from "../context/PostContext";

/**
 * Custom hook to access post context
 * Throws error if used outside PostProvider
 * @returns {object} - Post context value
 */
const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }

  return context;
};

export default usePosts;
