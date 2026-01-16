/**
 * LoadingSpinner component - Hiển thị vòng xoay khi chờ dữ liệu
 * @param {string} size - Kích thước: 'sm', 'md', 'lg' (mặc định 'md')
 * @param {boolean} fullScreen - Hiển thị giữa màn hình hay không
 * @param {string} className - Các style bổ sung
 */
const LoadingSpinner = ({
  size = "md",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses = {
    lg: "w-16 h-16 border-4",
    md: "w-10 h-10 border-4",
    sm: "w-6 h-6 border-2",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-gray-200 border-t-black ${sizeClasses[size]} ${className}`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-white/80">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-5 w-full">{spinner}</div>
  );
};

export default LoadingSpinner;
