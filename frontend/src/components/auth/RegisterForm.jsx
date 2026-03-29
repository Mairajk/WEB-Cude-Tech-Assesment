import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuth from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

/**
 * Yup validation schema for registration form
 * oneOf used for password confirmation matching
 */
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  role: yup.string().oneOf(["admin", "author"]).default("author"),
});

/**
 * RegisterForm Component
 * Uses React Hook Form + Yup for clean validation
 */
const RegisterForm = () => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  /**
   * Note: RHF's register function is renamed to rhfRegister
   * to avoid conflict with auth context's register function
   */
  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "author",
    },
  });

  /**
   * Called by RHF only when all Yup validations pass
   * Strips confirmPassword before sending to API
   * @param {object} data - Validated form data
   */
  const onSubmit = async (data) => {
    clearError();

    /** confirmPassword not needed by API — remove it */
    const payload = { ...data };
    delete payload.confirmPassword;

    const result = await registerUser(payload);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/** Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join BlogMS and start writing today
          </p>
        </div>

        {/** Server-side error */}
        <ErrorMessage message={error} onDismiss={clearError} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...rhfRegister("name")}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...rhfRegister("email")}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            error={errors.password?.message}
            {...rhfRegister("password")}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...rhfRegister("confirmPassword")}
          />

          {/** Role selector — connected to RHF */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                bg-white hover:border-gray-400 transition-colors"
              {...rhfRegister("role")}
            >
              <option value="author">Author</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
