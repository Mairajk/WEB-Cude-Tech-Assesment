import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usePosts from "../../hooks/usePosts";
import useAuth from "../../hooks/useAuth";
import PostList from "../../components/post/PostList";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";

/**
 * MyPostsPage
 * Admin sees ALL posts from every author
 * Author sees only their own posts
 * Removed useCallback — React Compiler handles memoization
 */
const MyPostsPage = () => {
  const {
    myPosts,
    loading,
    pagination,
    fetchMyPosts,
    deletePost,
    updatePostStatus,
  } = usePosts();

  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Current filter params object
   * Defined once here and reused across all handlers
   * Avoids repeating the same object in multiple places
   */
  const currentParams = {
    page,
    limit: 10,
    status: statusFilter || undefined,
  };

  /**
   * Fetch posts whenever page or status filter changes
   * currentParams is inlined so React can track dependencies
   */
  useEffect(() => {
    fetchMyPosts(currentParams);
  }, [page, statusFilter]);

  /**
   * Handle post deletion with confirmation
   * Refetches list after deletion to sync pagination
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    const result = await deletePost(id);
    if (result.success) fetchMyPosts(currentParams);
    setDeletingId(null);
  };

  /**
   * Handle status toggle
   * Passes current params so filtered view stays accurate
   */
  const handleStatusChange = async (id, status) => {
    await updatePostStatus(id, status, currentParams);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isAdmin() ? "All Posts" : "My Posts"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin()
              ? "Manage all posts from every author"
              : "Manage your own blog posts"}
          </p>
        </div>
        <Link to="/dashboard/create-post">
          <Button variant="primary" size="md">
            + New Post
          </Button>
        </Link>
      </div>

      {/** Status Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { label: "All", value: "" },
          { label: "Published", value: "published" },
          { label: "Drafts", value: "draft" },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => {
              setStatusFilter(value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <PostList
        posts={myPosts}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        showActions={true}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        emptyMessage={
          isAdmin()
            ? "No posts found in the system."
            : "You haven't created any posts yet."
        }
      />
    </DashboardLayout>
  );
};

export default MyPostsPage;
