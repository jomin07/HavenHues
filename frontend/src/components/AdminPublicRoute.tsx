import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from "../store/store";

const AdminPublicRoute = () => {
    const { isAdminLoggedIn } = useSelector((state: RootState) => state.auth);
    return isAdminLoggedIn ? <Navigate to='/admin/home' /> : <Outlet />
}

export default AdminPublicRoute;