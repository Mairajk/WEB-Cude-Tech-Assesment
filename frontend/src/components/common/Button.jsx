import Spinner from "./Spinner";

/**
 * Button Component
 * Reusable button with variants, sizes and loading state
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Shows spinner when true
 * @param {boolean} disabled - Disables button
 * @param {string} type - HTML button type
 * @param {Function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Spinner size="sm" color="white" />}
      {children}
    </button>
  );
};

export default Button;
