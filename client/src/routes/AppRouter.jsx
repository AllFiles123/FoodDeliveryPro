import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import OnboardingPage from "../pages/Onboarding/OnboardingPage";

import LanguagePage from "../pages/Language/LanguagePage";
import LocationPage from "../pages/Location/LocationPage";

import HomePage from "../pages/Home/HomePage";
import SearchPage from "../pages/Search/SearchPage";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import OtpVerificationPage from "../pages/Auth/OtpVerificationPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

import ProfilePage from "../pages/Profile/ProfilePage";

import ExploreReelsPage from "../pages/ExploreReels/ExploreReelsPage";
import RestaurantListPage from "../pages/Restaurant/RestaurantListPage";
import RestaurantDetailsPage from "../pages/Restaurant/RestaurantDetailsPage";

import CategoryFoodsPage from "../pages/CategoryFoods/CategoryFoodsPage";

import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import OrdersPage from "../pages/Orders/OrdersPage";

import Favourite from "../pages/Favourite/Favourite";
import Map from "../pages/Map/Map";

import FoodDetails from "../pages/FoodDetails/FoodDetails";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <Routes>

      <Route element={<MainLayout />}>

        {/* =====================================================
            APP ENTRY

            Splash permanently removed.

            App now starts from onboarding.
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/onboarding"
              replace
            />
          }
        />

        {/* =====================================================
            ONBOARDING
        ===================================================== */}

        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />

        {/* =====================================================
            LANGUAGE
        ===================================================== */}

        <Route
          path="/language"
          element={<LanguagePage />}
        />

        {/* =====================================================
            LOCATION

            Language -> Location -> Home
        ===================================================== */}

        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <LocationPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* =====================================================
            SIGNUP
        ===================================================== */}

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* =====================================================
            FORGOT PASSWORD
        ===================================================== */}

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* =====================================================
            OTP
        ===================================================== */}

        <Route
          path="/otp"
          element={<OtpVerificationPage />}
        />

        {/* =====================================================
            RESET PASSWORD
        ===================================================== */}

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            EXPLORE REELS
        ===================================================== */}

        <Route
          path="/explore-reels"
          element={
            <ProtectedRoute>
              <ExploreReelsPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            RESTAURANT LIST
        ===================================================== */}

        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            RESTAURANT DETAILS

            IMPORTANT:
            RestaurantListPage uses:

              /restaurants/:id

            So this route MUST use the same path.
        ===================================================== */}

        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            BACKWARD COMPATIBILITY

            If any old component still uses:

              /restaurant/:id

            it will still work.
        ===================================================== */}

        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CATEGORY FOODS
        ===================================================== */}

        <Route
          path="/category/:category"
          element={
            <ProtectedRoute>
              <CategoryFoodsPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            FOOD DETAILS
        ===================================================== */}

        <Route
          path="/food/:id"
          element={
            <ProtectedRoute>
              <FoodDetails />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            FAVOURITE
        ===================================================== */}

        <Route
          path="/favourite"
          element={
            <ProtectedRoute>
              <Favourite />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CART
        ===================================================== */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CHECKOUT
        ===================================================== */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ORDERS
        ===================================================== */}

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            PROFILE
        ===================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            MAP
        ===================================================== */}

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            UNKNOWN ROUTE

            NEVER SEND UNKNOWN ROUTES TO SPLASH.

            Send authenticated/normal app users to Home.
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/home"
              replace
            />
          }
        />

      </Route>

    </Routes>
  );
}
