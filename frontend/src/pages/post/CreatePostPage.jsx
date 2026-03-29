import { useNavigate } from "react-router-dom";
import usePosts from "../../hooks/usePosts";
import PostForm from "../../components/post/PostForm";
import DashboardLayout from "../../components/layout/DashboardLayout";

/**
 * CreatePostPage
 * Dashboard page for creating a new blog post
 * Uses PostForm component with create-specific config
 */
const CreatePostPage = () => {
  const { createPost, loading, error, clearError } = usePosts();
  const navigate = useNavigate();

  /**
   * Handle post creation
   * On success redirects to my posts page
   * @param {object} postData - Validated form data from PostForm
   */
  const handleSubmit = async (postData) => {
    const result = await createPost(postData);
    if (result.success) {
      navigate("/dashboard/my-posts");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        {/** Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
          <p className="text-gray-500 mt-1">Write and publish your article</p>
        </div>

        {/** Post Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <PostForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            submitLabel="Create Post"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePostPage;
