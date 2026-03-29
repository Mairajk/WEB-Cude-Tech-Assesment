import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usePosts from "../../hooks/usePosts";
import PostList from "../../components/post/PostList";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";

/**
 * MyPostsPage
 * Dashboard page showing authenticated user's posts
 * Supports status filtering and pagination
 * Provides edit, delete and status toggle actions
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

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Fetch posts whenever page or status filter changes
   */
  useEffect(() => {
    fetchMyPosts({
      page,
      limit: 10,
      status: statusFilter || undefined,
    });
  }, [page, statusFilter]);

  /**
   * Handle post deletion with confirmation
   * @param {string} id - Post ID to delete
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    await deletePost(id);
    setDeletingId(null);
  };

  /**
   * Handle post status toggle (draft/published)
   * @param {string} id - Post ID
   * @param {string} status - New status
   */
  const handleStatusChange = async (id, status) => {
    await updatePostStatus(id, status);
  };

  return (
    <DashboardLayout>
      {/** Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
          <p className="text-gray-500 mt-1">Manage all your blog posts</p>
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

      {/** Posts List with actions */}
      <PostList
        posts={myPosts}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        showActions={true}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        emptyMessage="You haven't created any posts yet."
      />
    </DashboardLayout>
  );
};

export default MyPostsPage;
