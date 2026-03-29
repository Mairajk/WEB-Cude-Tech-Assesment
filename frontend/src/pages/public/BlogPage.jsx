import { useState, useEffect } from "react";
import usePosts from "../../hooks/usePosts";
import PostCard from "../../components/post/PostCard";
import PostList from "../../components/post/PostList";
import PublicLayout from "../../components/layout/PublicLayout";

/**
 * BlogPage
 * Public page showing all published posts
 * Supports search, tag filtering and pagination
 */
const BlogPage = () => {
  const { posts, loading, pagination, fetchPosts } = usePosts();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);

  /**
   * Fetch posts whenever search, tag or page changes
   * Debounce not needed here since we trigger on form submit
   */
  useEffect(() => {
    fetchPosts({
      search: search || undefined,
      tags: selectedTag || undefined,
      page,
      limit: 10,
    });
  }, [page, selectedTag]);

  /**
   * Handle search form submission
   * Resets to page 1 on new search
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts({ search: search || undefined, page: 1, limit: 10 });
  };

  /**
   * Handle tag filter click
   * Toggles tag selection
   */
  const handleTagClick = (tag) => {
    setSelectedTag((prev) => (prev === tag ? "" : tag));
    setPage(1);
  };

  /**
   * Collect all unique tags from current posts for filter buttons
   */
  const allTags = [...new Set(posts.flatMap((post) => post.tags || []))];

  return (
    <PublicLayout>
      {/** Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog</h1>
        <p className="text-gray-500">
          Explore articles from our community of writers
        </p>
      </div>

      {/** Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title or content..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              hover:border-gray-400 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium
              rounded-lg hover:bg-blue-700 transition-colors focus:outline-none
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
                fetchPosts({ page: 1, limit: 10 });
              }}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm
                rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/** Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/** Posts List */}
      <PostList
        posts={posts}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        emptyMessage={
          search
            ? `No posts found for "${search}"`
            : "No published posts yet. Check back soon!"
        }
      />
    </PublicLayout>
  );
};

export default BlogPage;
