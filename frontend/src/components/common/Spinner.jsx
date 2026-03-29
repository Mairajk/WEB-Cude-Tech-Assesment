/**
 * Spinner Component
 * Displayed during loading states throughout the app
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} color - Tailwind color class
 */
const Spinner = ({ size = "md", color = "blue" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-${color}-200 border-t-${color}-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
