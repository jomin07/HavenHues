import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

const AdminPrivateRoute = () => {
  const { isAdminLoggedIn } = useSelector((state: RootState) => state.auth);
  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/admin/" />;
};

export default AdminPrivateRoute;
