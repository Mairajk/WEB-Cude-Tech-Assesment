import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

/**
 * Yup validation schema for login form
 * Defines rules and error messages for each field
 */
const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

/**
 * LoginForm Component
 * Uses React Hook Form + Yup for validation
 * Much cleaner than manual useState validation
 */
const LoginForm = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  /**
   * React Hook Form setup
   * register — connects inputs to RHF
   * handleSubmit — wraps our submit handler with validation
   * formState.errors — validation errors per field
   * watch — watch field values in real time
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Called by RHF only when validation passes
   * @param {object} data - Validated form data
   */
  const onSubmit = async (data) => {
    clearError();
    const result = await login(data);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/** Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/** Server-side error from auth context */}
        <ErrorMessage message={error} onDismiss={clearError} />

        {/** Form — handleSubmit from RHF wraps our onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/**
           * Input uses RHF's register to connect to form state
           * error comes from Yup validation via RHF
           */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
