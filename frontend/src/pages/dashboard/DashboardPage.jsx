import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import usePosts from "../../hooks/usePosts";
import useApi from "../../hooks/useApi";
import statsService from "../../services/statsService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PostList from "../../components/post/PostList";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

/**
 * StatsCard Component (local)
 * Small card showing a single stat metric
 */
const StatsCard = ({ label, value, icon, color = "blue" }) => (
  <div className={`bg-${color}-50 border border-${color}-100 rounded-xl p-6`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

/**
 * DashboardPage
 * Overview page shown after login
 * Admins see full stats, authors see their own post summary
 */
const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const { myPosts, loading, fetchMyPosts } = usePosts();
  const { data: statsData, loading: statsLoading, execute } = useApi();

  /**
   * Fetch user's posts on mount
   * Admins also fetch global stats
   */
  useEffect(() => {
    fetchMyPosts({ limit: 5 });
    if (isAdmin()) {
      execute(statsService.getPostStats);
    }
  }, []);

  return (
    <DashboardLayout>
      {/** Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your blog
        </p>
      </div>

      {/** Admin Stats Section */}
      {isAdmin() && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Blog Statistics
          </h2>
          {statsLoading ? (
            <Spinner size="md" />
          ) : statsData ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatsCard
                  label="Total Posts"
                  value={statsData.stats?.totalPosts || 0}
                  icon="📝"
                  color="blue"
                />
                <StatsCard
                  label="Published"
                  value={statsData.stats?.publishedPosts || 0}
                  icon="🟢"
                  color="green"
                />
                <StatsCard
                  label="Drafts"
                  value={statsData.stats?.draftPosts || 0}
                  icon="🟡"
                  color="yellow"
                />
                <StatsCard
                  label="Comments"
                  value={statsData.stats?.totalComments || 0}
                  icon="💬"
                  color="purple"
                />
              </div>

              {/** Top Authors Table */}
              {statsData.topAuthors?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">Top Authors</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {statsData.topAuthors.map((author, index) => (
                      <div
                        key={author.email}
                        className="flex items-center justify-between px-6 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-300">
                            #{index + 1}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {author.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {author.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {author.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-700">
                            {author.postCount} posts
                          </p>
                          <p className="text-xs text-green-500">
                            {author.publishedCount} published
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </section>
      )}

      {/** Recent Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Recent Posts</h2>
          <Link to="/dashboard/posts">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        <PostList
          posts={myPosts.slice(0, 5)}
          loading={loading}
          showActions={true}
          emptyMessage="You haven't written any posts yet."
        />

        <div className="mt-6">
          <Link to="/dashboard/create-post">
            <Button variant="primary" size="md">
              ✏️ Write New Post
            </Button>
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
