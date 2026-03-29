import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import postService from "../../services/postService";
import CommentList from "../../components/comment/CommentList";
import PostStatusBadge from "../../components/post/PostStatusBadge";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import PublicLayout from "../../components/layout/PublicLayout";
import useAuth from "../../hooks/useAuth";
import { formatDate, readingTime } from "../../utils/helpers";

/**
 * PostDetailPage
 * Full post view with content and comments
 * Accessible publicly for published posts
 * Authors/admins can see their own draft posts
 */
const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch post by ID on mount
   * Handles 404 and permission errors
   */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postService.getPostById(id);
        setPost(response.data.post);
      } catch (err) {
        setError(err.response?.data?.message || "Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  /**
   * Check if current user can edit this post
   * True for post owner or admin
   */
  const canEdit =
    isAuthenticated &&
    post &&
    (user?.id === post.author?._id || user?.role === "admin");

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20">
          <Spinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/blog">
            <Button variant="primary">← Back to Blog</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto">
        {/** Post Header */}
        <header className="mb-8">
          {/** Status badge for draft posts */}
          {post.status === "draft" && (
            <div className="mb-4">
              <PostStatusBadge status={post.status} />
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-4">
            {post.title}
          </h1>

          {/** Meta info */}
          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-600">
                {post.author?.name}
              </span>
            </div>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span>•</span>
            <span>{readingTime(post.content)}</span>
          </div>

          {/** Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-xs
                    rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/** Edit button for owner/admin */}
          {canEdit && (
            <div className="flex gap-3">
              <Link to={`/dashboard/edit-post/${post._id}`}>
                <Button variant="secondary" size="sm">
                  ✏️ Edit Post
                </Button>
              </Link>
            </div>
          )}
        </header>

        {/** Divider */}
        <hr className="border-gray-200 mb-8" />

        {/** Post Content */}
        <div className="prose prose-gray max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.content}
          </div>
        </div>

        {/** Divider */}
        <hr className="border-gray-200 mt-12 mb-4" />

        {/** Back link */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/blog" className="text-sm text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
          {canEdit && (
            <Link to={`/dashboard/edit-post/${post._id}`}>
              <Button variant="secondary" size="sm">
                ✏️ Edit Post
              </Button>
            </Link>
          )}
        </div>

        {/** Comments Section */}
        <CommentList postId={post._id} />
      </article>
    </PublicLayout>
  );
};

export default PostDetailPage;
