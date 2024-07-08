import { FaBars } from "react-icons/fa";
import AdminSignOutButton from "./AdminSignOutButton";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <div className="bg-gray-800 px-4 py-3 flex justify-between">
      <div className="flex items-center text-xl">
        <FaBars
          className="text-white cursor-pointer me-4"
          onClick={toggleSidebar}
        />
        <span className="text-white font-semibold">HavenHues</span>
      </div>
      <div className="flex items-center gap-x-5">
        <AdminSignOutButton />
      </div>
    </div>
  );
};

export default Navbar;
