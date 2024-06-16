import { BiSolidReport } from "react-icons/bi";
import { FaHome,FaUsers } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { RiCoupon2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

interface SidebarProps {
    isVisible: boolean;
}

const Sidebar = ({ isVisible }: SidebarProps) =>{
    return(
        <div className={` bg-gray-800 fixed h-full transition-all duration-300 ${isVisible ? 'w-64 px-4 py-2' : 'w-0'} overflow-hidden`}>
            <div className="my-2 mb-4">
                <h1 className="text-2xl text-white font-bold">Admin Panel</h1>
            </div>
            <hr />
            <ul className="mt-3 text-white font-bold">

                <Link to={"/admin/home"}>
                    <li className="mb-3 rounded hover:shadow hover:bg-blue-500 py-2">
                        <a href="" className="px-3">
                            <FaHome className="inline-block w-6 h-6 mr-3 -mt-2"></FaHome>
                            Dashboard
                        </a>
                    </li>
                </Link>

                <Link to={"/admin/users"}>
                    <li className="mb-3 rounded hover:shadow hover:bg-blue-500 py-2">
                        <a href="" className="px-3">
                            <FaUsers className="inline-block w-6 h-6 mr-3 -mt-2"></FaUsers>
                            Users
                        </a>
                    </li>
                </Link>
        
                <Link to={"/admin/hotels"}>
                    <li className="mb-3 rounded hover:shadow hover:bg-blue-500 py-2">
                        <a href="" className="px-3">
                            <FaHotel className="inline-block w-6 h-6 mr-3 -mt-2"></FaHotel>
                            Hotels
                        </a>
                    </li>
                </Link>

                <Link to={"/admin/coupons"}>
                    <li className="mb-3 rounded hover:shadow hover:bg-blue-500 py-2">
                        <a href="" className="px-3">
                            <RiCoupon2Fill  className="inline-block w-6 h-6 mr-3 -mt-1"></RiCoupon2Fill>
                            Coupons
                        </a>
                    </li>
                </Link>
                
                <Link to={"/admin/bookings"}>
                    <li className="mb-3 rounded hover:shadow hover:bg-blue-500 py-2">
                        <a href="" className="px-3">
                            <BiSolidReport className="inline-block w-6 h-6 mr-3 -mt-2"></BiSolidReport>
                            Bookings
                        </a>
                    </li>
                </Link>
                
                <li className="mb-3 rounded hover:shadow hover:bg-blue-500 py-2">
                    <a href="" className="px-3">
                        <IoIosSettings className="inline-block w-6 h-6 mr-3 -mt-2"></IoIosSettings>
                        Settings
                    </a>
                </li>
            </ul>


        </div>
    );
}

export default Sidebar;