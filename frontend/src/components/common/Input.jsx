import { forwardRef, useState } from "react";

/**
 * Input Component
 * Uses forwardRef so React Hook Form can access the input ref
 * Includes password visibility toggle for password fields
 * @param {string} label - Input label
 * @param {string} name - Input name
 * @param {string} type - Input type
 * @param {string} error - Validation error message
 * @param {string} helperText - Helper text below input
 * @param {boolean} required - Whether field is required
 */
const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      error,
      placeholder,
      required = false,
      helperText,
      className = "",
      ...rest
    },
    ref,
  ) => {
    /**
     * Track password visibility state locally
     * Only relevant when type is password
     */
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Determine actual input type
     * Toggle between password and text for visibility
     */
    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/** Input wrapper for positioning eye button */}
        <div className="relative">
          <input
            id={name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            required={required}
            ref={ref}
            className={`
            w-full px-3 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${type === "password" ? "pr-10" : ""}
            ${
              error
                ? "border-red-400 bg-red-50 focus:ring-red-400"
                : "border-gray-300 bg-white hover:border-gray-400"
            }
            ${className}
          `}
            {...rest}
          />

          {/** Eye toggle button — only shown for password fields */}
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
              hover:text-gray-600 transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                /** Hide icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                  />
                </svg>
              ) : (
                /** Show icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-gray-400 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
