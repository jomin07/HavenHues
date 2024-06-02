import { Link } from "react-router-dom"
// import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { useSelector } from 'react-redux';
import { RootState } from "../store/store";

const Header = () =>{
    // const { isLoggedIn } = useAppContext();
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    return(
        <div className="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">HavenHues</Link>
                </span>
                <span className="flex space-x-2">
                    {isLoggedIn ? (
                        <>
                            <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to={"/my-bookings"}>My Bookings</Link>
                            <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to={"/my-hotels"}>My Hotels</Link>
                            <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to={"/profile"}>My Profile</Link>
                            <SignOutButton />
                        </>
                    ): (
                        <Link to="/sign-in" className="bg-white flex items-center text-blue-600 px-3 font-bold hover:bg-gray-100">Sign In</Link>
                    )}
                </span>
            </div>
        </div>
    );
}

export default Header;