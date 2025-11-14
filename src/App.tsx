import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";
import React, {
  Suspense,
  useContext,
  useEffect,
  useState,
  lazy,
} from "react";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import { UserContext } from "./context/UserContext";
import { AuthServiceInstance } from "./service/auth.service";
import { useFetch } from "./hooks/useFetch";

import UserPersmission from "./pages/UserPermission/UserPersmission";
import BannerBucket from "./pages/S3Bucket/BannerBucket";
import BannerListing from "./pages/S3Bucket/BannerListing";
import AllProducts from "./pages/AllProduct/AllProducts";

const Home = lazy(() => import("./pages/Dashboard/Home"));

// -------------------------
// 🔒 PROTECTED ROUTE
// -------------------------
function ProtectedRoute({ children }) {
  const { user, setUser } = useContext(UserContext)!;
  const { fn, data, loading, error } = useFetch(AuthServiceInstance.adminProfile);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      fn().finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  if (checking || loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );

  if ((!user && !data) || error) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}


// -------------------------
// 🚀 MAIN APP ROUTER
// -------------------------
export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>

        {/* EVERYTHING INSIDE APP LAYOUT IS PROTECTED */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            index
            path="/"
            element={
              <Suspense fallback={<p>Loading dashboard...</p>}>
                <Home />
              </Suspense>
            }
          />

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/user-permission" element={<UserPersmission />} />
          <Route path="/banner-bucket" element={<BannerBucket />} />
          <Route path="/banner-table" element={<BannerListing />} />
          <Route path="/all-products" element={<AllProducts />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* UI Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
