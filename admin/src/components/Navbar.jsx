import { Link } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-[4%] py-2">
      <Link to="/">
        <img
          alt=""
          className="w-[max(10%,80px)] cursor-pointer"
          src={assets.logo}
        />
      </Link>
      <button
        className="bg-gray-600 px-5 sm:px-7 py-2 sm:py-2 rounded-md text-white text-xs sm:text-sm"
        type="button"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
