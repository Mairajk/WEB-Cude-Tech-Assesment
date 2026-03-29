import { Link } from "react-router-dom";
import { useEffect } from "react";
import usePosts from "../../hooks/usePosts";
import PostCard from "../../components/post/PostCard";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import PublicLayout from "../../components/layout/PublicLayout";

/**
 * HomePage
 * Public landing page showing hero section and latest posts
 * Fetches latest 6 published posts for preview
 */
const HomePage = () => {
  const { posts, loading, fetchPosts } = usePosts();

  /**
   * Fetch latest 6 published posts on mount
   * Sorted by newest first
   */
  useEffect(() => {
    fetchPosts({ limit: 6, sortBy: "createdAt", order: "desc" });
  }, []);

  return (
    <PublicLayout>
      {/** Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-6xl mb-6 block">📝</span>
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Welcome to <span className="text-blue-600">BlogMS</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            A modern blog management platform for authors and admins. Write,
            publish and manage your content with ease.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/blog">
              <Button variant="primary" size="lg">
                Browse Posts →
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Start Writing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/** Features Section */}
      <section className="py-16 border-t border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Everything you need
          </h2>
          <p className="text-gray-500">
            Built for writers, designed for readers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "✍️",
              title: "Easy Writing",
              desc: "Create and manage posts with our clean editor. Draft, edit and publish with ease.",
            },
            {
              icon: "🔐",
              title: "Role Based Access",
              desc: "Admin and author roles with fine-grained permissions for every action.",
            },
            {
              icon: "🔍",
              title: "Search & Filter",
              desc: "Find any post instantly with full-text search and tag-based filtering.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-4xl mb-4 block">{icon}</span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/** Latest Posts Section */}
      <section className="py-16 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Latest Posts</h2>
            <p className="text-gray-500 mt-1">Fresh content from our authors</p>
          </div>
          <Link to="/blog">
            <Button variant="ghost" size="md">
              View All →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No posts published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 6).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
};

export default HomePage;
