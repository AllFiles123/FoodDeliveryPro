import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import SplashPage from "../pages/Splash/SplashPage";
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
            APP STARTUP
            EVERY APP OPEN STARTS FROM SPLASH
        ===================================================== */}
        <Route
          path="/"
          element={<SplashPage />}
        />

        {/* =====================================================
            ONBOARDING
        ===================================================== */}
        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />

        {/* =====================================================
            FIRST LOGIN SETUP
            These MUST remain outside ProtectedRoute because
            they are part of the first-login setup flow.
        ===================================================== */}
        <Route
          path="/language"
          element={<LanguagePage />}
        />

        <Route
          path="/location"
          element={<LocationPage />}
        />

        {/* =====================================================
            AUTH
        ===================================================== */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/otp"
          element={<OtpVerificationPage />}
        />

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
            RESTAURANTS
        ===================================================== */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CATEGORY
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
            NEVER SHOW SPLASH HERE
        ===================================================== */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Route>
    </Routes>
  );
}
