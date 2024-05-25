import {  Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { isAdminLoggedIn } = useAppContext();
  console.log(isAdminLoggedIn);
  

  if (!isAdminLoggedIn) {
    return <Navigate to='/admin/admin-login' />;
  }

  return <>{children}</>;
}

export default ProtectedAdminRoute;
