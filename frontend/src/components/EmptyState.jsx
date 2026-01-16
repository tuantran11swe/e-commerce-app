import { Link } from "react-router-dom";

/**
 * EmptyState component - Hiển thị khi không có sản phẩm, giỏ hàng trống, v.v.
 * @param {string} title - Tiêu đề thông báo
 * @param {string} message - Nội dung chi tiết
 * @param {string} icon - icon (assets path)
 * @param {string} btnText - Text của nút hành động
 * @param {string} btnLink - Đường dẫn của nút hành động
 */
const EmptyState = ({ title, message, icon, btnText, btnLink = "/" }) => {
  return (
    <div className="flex flex-col justify-center items-center px-4 py-20 text-center">
      {icon && <img alt="" className="opacity-50 mb-4 w-20" src={icon} />}
      <h3 className="mb-2 font-medium text-gray-800 text-xl">{title}</h3>
      <p className="mb-8 max-w-md text-gray-500">{message}</p>
      {btnText && (
        <Link
          className="bg-black hover:opacity-90 px-8 py-3 rounded-sm font-medium text-white text-sm transition-all"
          to={btnLink}
        >
          {btnText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
