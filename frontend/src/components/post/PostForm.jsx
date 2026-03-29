import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

/**
 * Yup validation schema for post form
 * Used for both create and edit post flows
 */
const postSchema = yup.object({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters")
    .required("Title is required"),
  content: yup
    .string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  tags: yup
    .string()
    .optional()
    .test(
      "max-tags",
      "Cannot have more than 10 tags",
      (value) => !value || value.split(",").length <= 10,
    ),
  excerpt: yup
    .string()
    .max(300, "Excerpt cannot exceed 300 characters")
    .optional(),
  status: yup.string().oneOf(["draft", "published"]).default("draft"),
});

/**
 * PostForm Component
 * Reusable form for both creating and editing posts
 * Uses React Hook Form + Yup validation
 * @param {object} initialData - Pre-filled data for edit mode
 * @param {Function} onSubmit - Submit handler from parent
 * @param {boolean} loading - Loading state for submit button
 * @param {string} error - Server error message
 * @param {string} submitLabel - Custom submit button label
 */
const PostForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  error = null,
  submitLabel = "Save Post",
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      excerpt: "",
      status: "draft",
    },
  });

  /**
   * Populate form with existing data in edit mode
   * Converts tags array back to comma-separated string for input
   */
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        content: initialData.content || "",
        tags: initialData.tags?.join(", ") || "",
        excerpt: initialData.excerpt || "",
        status: initialData.status || "draft",
      });
    }
  }, [initialData, reset]);

  /**
   * Transform form data before passing to parent
   * Converts tags string to array and trims whitespace
   * @param {object} data - Raw form data from RHF
   */
  const handleFormSubmit = (data) => {
    const transformedData = {
      ...data,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : [],
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/** Server error */}
      {error && <ErrorMessage message={error} />}

      {/** Title */}
      <Input
        label="Post Title"
        name="title"
        type="text"
        placeholder="Enter an engaging title..."
        error={errors.title?.message}
        required
        {...register("title")}
      />

      {/** Content */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Write your post content here..."
          rows={12}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200 resize-y
            ${
              errors.content
                ? "border-red-400 bg-red-50 focus:ring-red-400"
                : "border-gray-300 bg-white hover:border-gray-400"
            }
          `}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-red-500 mt-0.5">
            {errors.content.message}
          </p>
        )}
      </div>

      {/** Excerpt */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Excerpt <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          placeholder="Short description shown in post listings..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200 resize-none hover:border-gray-400"
          {...register("excerpt")}
        />
        {errors.excerpt && (
          <p className="text-xs text-red-500 mt-0.5">
            {errors.excerpt.message}
          </p>
        )}
      </div>

      {/** Tags */}
      <Input
        label="Tags"
        name="tags"
        type="text"
        placeholder="react, javascript, css (comma separated)"
        error={errors.tags?.message}
        helperText="Separate tags with commas. Max 10 tags."
        {...register("tags")}
      />

      {/** Status & Submit Row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/** Status selector */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white hover:border-gray-400 transition-colors"
            {...register("status")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/** Submit button */}
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
