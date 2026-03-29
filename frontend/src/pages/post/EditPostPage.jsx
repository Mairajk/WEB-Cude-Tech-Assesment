import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePosts from "../../hooks/usePosts";
import postService from "../../services/postService";
import PostForm from "../../components/post/PostForm";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";

/**
 * EditPostPage
 * Dashboard page for editing an existing post
 * Uses authenticated API call so drafts are accessible
 */
const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePost, loading, error, clearError } = usePosts();
  const [post, setPost] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchLoading(true);

        /**
         * postService.getPostById uses the authenticated api instance
         * so the Bearer token is sent automatically via axios interceptor
         * This allows fetching draft posts that belong to the user
         */
        const response = await postService.getPostById(id);
        setPost(response.data.post);
      } catch (err) {
        setFetchError(err.response?.data?.message || "Failed to load post");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (postData) => {
    const result = await updatePost(id, postData);
    if (result.success) {
      navigate("/dashboard/my-posts");
    }
  };

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="py-20">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl">
          <ErrorMessage message={fetchError} />
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate("/dashboard/my-posts")}
          >
            ← Back to My Posts
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        {/** Page Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/my-posts")}
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Post</h1>
            <p className="text-gray-500 mt-1">
              Update your article content and settings
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <PostForm
            initialData={post}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Update Post"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditPostPage;
