import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import useAuth from "../../hooks/useAuth";

/**
 * RegisterPage
 * Public page that renders the registration form
 * Redirects to dashboard if user is already authenticated
 */
const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * Redirect authenticated users away from register page
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/** Top branding */}
        <div className="text-center mb-8">
          <span className="text-4xl">📝</span>
          <h2 className="text-xl font-bold text-gray-700 mt-2">BlogMS</h2>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
