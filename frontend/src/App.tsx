import { 
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate 
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import Users from "./pages/Users";
import Dashboard from "./components/Dashboard";
import Profile from "./pages/Profile";

const App = () =>{
  const { isLoggedIn } = useAppContext();
  return(
    <Router>
      <Routes>

        <Route path='/' 
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }  
        />
        
        <Route path='/search' 
          element={
            <Layout>
                <p>Search</p>
            </Layout>
          } 
        />

        
        <Route path='/register' 
          element={
            <Layout>
                <Register />
            </Layout>
          } 
        />

        <Route path='/verify-otp' 
          element={
            <Layout>
                <VerifyOtp />
            </Layout>
          } 
        />

        <Route path={"/sign-in"} 
          element={
            <Layout>
              <SignIn />
            </Layout>
          } 
        />

        <Route path="/forgot-password" 
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          } 
        />
        
        <Route path="/reset-password"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          } 
        />

        {isLoggedIn && (
          <>
            <Route path={"/add-hotel"} 
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              } 
            />
            <Route path={"/my-hotels"} 
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              } 
            />
            <Route path={"/profile"} 
              element={
                <Layout>
                  <Profile />
                </Layout>
              } 
            />
          </>
        )}

        <Route path='/admin/*' element={<AdminLayoutRoutes />} />

        <Route path='*' 
          element={
            <Navigate to='/' />
          } 
        />
      </Routes>
    </Router>
  );
}

const AdminLayoutRoutes = () =>{
  const { isAdminLoggedIn } = useAppContext();
  return(
    <Routes>
      <Route path={"/"} 
          element={isAdminLoggedIn ? <Navigate to="/admin/home" /> : <AdminLogin />} 
      />
      {!isAdminLoggedIn ? (
        <>
        <Route path="*" element={<Navigate to="/admin/" />}/>
      </>):(
        <>
          <Route path="/home" element={<AdminLayout><Dashboard /></AdminLayout>}/>
          <Route path="/users" element={<AdminLayout><Users /></AdminLayout>} />
        </>
      )}

    </Routes>
  );
}


export default App;
