// Component hiển thị tiêu đề với 2 phần text và đường gạch ngang
const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center gap-2 mb-3">
      {/* Phần text tiêu đề - text1 màu xám nhạt, text2 màu xám đậm và đậm */}
      <p className="text-gray-500">
        {text1} <span className="font-medium text-gray-700">{text2}</span>
      </p>

      {/* Đường gạch ngang trang trí */}
      <p className="bg-gray-700 w-8 sm:w-12 h-px sm:h-0.5"></p>
    </div>
  );
};

export default Title;
