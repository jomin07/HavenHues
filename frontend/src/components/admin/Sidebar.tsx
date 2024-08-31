import { useState } from "react";
import { BiSolidReport } from "react-icons/bi";
import { FaHome, FaUsers } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";
import { RiCoupon2Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar = ({ isVisible }: SidebarProps) => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  const menuItems = [
    { path: "/admin/home", label: "Dashboard", icon: <FaHome /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
    { path: "/admin/hotels", label: "Hotels", icon: <FaHotel /> },
    { path: "/admin/coupons", label: "Coupons", icon: <RiCoupon2Fill /> },
    { path: "/admin/bookings", label: "Bookings", icon: <BiSolidReport /> },
  ];
  return (
    <div
      className={` bg-gray-800 fixed h-full transition-all duration-300 ${
        isVisible ? "w-64 px-4 py-2" : "w-0"
      } overflow-hidden`}
    >
      <div className="my-2 mb-4">
        <h1 className="text-2xl text-white font-bold">Admin Panel</h1>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <li
              className={`mb-3 rounded py-2 px-3 flex items-center ${
                selected === item.path
                  ? "bg-blue-600 shadow"
                  : "hover:bg-blue-500 hover:shadow"
              }`}
              onClick={() => setSelected(item.path)}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
