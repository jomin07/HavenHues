import { Link } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Header = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">HavenHues</Link>
        </span>
        <span className="flex space-x-1 md:space-x-2 lg:space-x-3">
          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to={"/my-bookings"}
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to={"/my-hotels"}
              >
                My Hotels
              </Link>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to={"/profile"}
              >
                Profile
              </Link>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to={"/chats"}
              >
                Chat
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white flex items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
