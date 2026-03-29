import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

/**
 * Yup schema for comment form
 */
const commentSchema = yup.object({
  content: yup
    .string()
    .min(2, "Comment must be at least 2 characters")
    .max(500, "Comment cannot exceed 500 characters")
    .required("Comment content is required"),
});

/**
 * CommentForm Component
 * Form for adding a new comment to a post
 * Shows login prompt if user is not authenticated
 * @param {Function} onSubmit - Submit handler from parent
 * @param {boolean} loading - Loading state
 */
const CommentForm = ({ onSubmit, loading = false }) => {
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: { content: "" },
  });

  /**
   * Submit comment then reset form on success
   * @param {object} data - { content }
   */
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  /**
   * Show login prompt for unauthenticated users
   * Comments require authentication
   */
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-3">
          Please sign in to leave a comment
        </p>
        <Link
          to="/login"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Sign in →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Add a comment
        </label>
        <textarea
          placeholder="Share your thoughts..."
          rows={3}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200 resize-none
            ${
              errors.content
                ? "border-red-400 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }
          `}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="md" loading={loading}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
