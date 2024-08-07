import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Users from "./pages/admin/Users";
import Profile from "./pages/Profile";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AdminPublicRoute from "./components/admin/AdminPublicRoute";
import AdminPrivateRoute from "./components/admin/AdminPrivateRoute";
import HotelBookings from "./pages/HotelBookings";
import Coupons from "./pages/admin/Coupons";
import CouponForm from "./pages/admin/CouponForm";
import Wallet from "./pages/Wallet";
import Hotels from "./pages/admin/Hotels";
import HotelDetails from "./pages/admin/HotelDetails";
import Dashboard from "./pages/admin/Dashboard";
import Bookings from "./pages/admin/Bookings";
import ChatPage from "./pages/ChatPage";
import Subscription from "./pages/Subscription";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelID"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />

        <Route element={<PublicRoute />}>
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <Layout>
                <VerifyOtp />
              </Layout>
            }
          />
          <Route
            path={"/sign-in"}
            element={
              <Layout>
                <SignIn />
              </Layout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Layout>
                <ForgotPassword />
              </Layout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Layout>
                <ResetPassword />
              </Layout>
            }
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route
            path={"/hotel/:hotelID/booking"}
            element={
              <Layout>
                <Booking />
              </Layout>
            }
          />
          <Route
            path={"/add-hotel"}
            element={
              <Layout>
                <AddHotel />
              </Layout>
            }
          />
          <Route
            path={"/edit-hotel/:hotelID"}
            element={
              <Layout>
                <EditHotel />
              </Layout>
            }
          />
          <Route
            path={"/my-hotels"}
            element={
              <Layout>
                <MyHotels />
              </Layout>
            }
          />
          <Route
            path="/hotel-bookings/:hotelId"
            element={
              <Layout>
                <HotelBookings />
              </Layout>
            }
          />
          <Route
            path={"/my-bookings"}
            element={
              <Layout>
                <MyBookings />
              </Layout>
            }
          />
          <Route
            path={"/profile"}
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path={"/wallet"}
            element={
              <Layout>
                <Wallet />
              </Layout>
            }
          />
          <Route
            path={"/chats"}
            element={
              <Layout>
                <ChatPage />
              </Layout>
            }
          />
          <Route
            path={"/subscription"}
            element={
              <Layout>
                <Subscription />
              </Layout>
            }
          />
          <Route
            path={"/checkout/:planId"}
            element={
              <Layout>
                <SubscriptionCheckout />
              </Layout>
            }
          />
        </Route>

        <Route path="/admin/*" element={<AdminLayoutRoutes />} />

        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

const AdminLayoutRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminPublicRoute />}>
        <Route path="/" element={<AdminLogin />} />
      </Route>

      <Route element={<AdminPrivateRoute />}>
        <Route
          path="/home"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />
        <Route
          path="/hotels"
          element={
            <AdminLayout>
              <Hotels />
            </AdminLayout>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <AdminLayout>
              <HotelDetails />
            </AdminLayout>
          }
        />
        <Route
          path="/coupons"
          element={
            <AdminLayout>
              <Coupons />
            </AdminLayout>
          }
        />
        <Route
          path="/coupons/new"
          element={
            <AdminLayout>
              <CouponForm />
            </AdminLayout>
          }
        />
        <Route
          path="/coupons/:id"
          element={
            <AdminLayout>
              <CouponForm />
            </AdminLayout>
          }
        />
        <Route
          path="/bookings"
          element={
            <AdminLayout>
              <Bookings />
            </AdminLayout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/admin/" />} />
    </Routes>
  );
};

export default App;
