import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePosts from "../../hooks/usePosts";
import postService from "../../services/postService";
import PostForm from "../../components/post/PostForm";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";

/**
 * EditPostPage
 * Dashboard page for editing an existing post
 * Fetches post data and pre-fills PostForm
 */
const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePost, loading, error, clearError } = usePosts();
  const [post, setPost] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  /**
   * Fetch existing post data to pre-fill the form
   */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchLoading(true);
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

  /**
   * Handle post update submission
   * Redirects to my posts on success
   * @param {object} postData - Updated form data
   */
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
        <ErrorMessage message={fetchError} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        {/** Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Post</h1>
          <p className="text-gray-500 mt-1">
            Update your article content and settings
          </p>
        </div>

        {/** Post Form with initial data */}
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
