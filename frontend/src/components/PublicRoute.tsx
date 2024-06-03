import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from "../store/store";

const PublicRoute = () => {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    return isLoggedIn ? <Navigate to='/' /> : <Outlet />
}

export default PublicRoute;