import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import AdminSignOutButton from "./AdminSignOutButton";

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) =>{
    return(
        <div className="bg-gray-800 px-4 py-3 flex justify-between">
            <div className="flex items-center text-xl">
                <FaBars className="text-white cursor-pointer me-4" onClick={toggleSidebar} />
                <span className="text-white font-semibold">HavenHues</span>
            </div>
            <div className="flex items-center gap-x-5">
                <div className="relative md:w-64 ml-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="text-gray-500" />
                    </span>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 pl-10 rounded shadow outline-none" 
                        placeholder="Search..." 
                    />
                </div>
                
                <div className="text-white"><FaBell className="h-6 w-6"/></div>

                <div className="relative">
                    <button className="text-white group">
                        <FaUserCircle className="w-6 h-6 mt-1"/>
                        <div className="z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0">
                            <ul className="py-2 text-sm text-gray-950">
                                <li><a href="#">Profile</a></li>
                                <li><a href="#">Settings</a></li>
                            </ul>
                        </div>
                    </button>
                </div>
                <AdminSignOutButton />
            </div>
        </div>
    );
}

export default Navbar;