import { useNavigate } from "react-router-dom";
import usePosts from "../../hooks/usePosts";
import PostForm from "../../components/post/PostForm";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";

/**
 * CreatePostPage
 * Dashboard page for creating a new blog post
 * Includes back button for consistent navigation UX
 */
const CreatePostPage = () => {
  const { createPost, loading, error } = usePosts();
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    const result = await createPost(postData);
    if (result.success) {
      navigate("/dashboard/my-posts");
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Post
            </h1>
            <p className="text-gray-500 mt-1">Write and publish your article</p>
          </div>
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
