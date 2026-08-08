import { Routes, Route } from "react-router-dom";

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
            SPLASH
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
            FIRST LOGIN LANGUAGE SELECTION
            IMPORTANT:
            Do NOT wrap this with PublicRoute.
        ===================================================== */}
        <Route
          path="/language"
          element={<LanguagePage />}
        />


        {/* =====================================================
            AUTH
        ===================================================== */}

        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* OTP */}
        <Route
          path="/otp"
          element={<OtpVerificationPage />}
        />

        {/* Reset Password */}
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />


        {/* =====================================================
            FIRST LOGIN LOCATION
            Language select করার পর এখানে আসবে.
            Location select করার পর সরাসরি Home.
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

        {/* Restaurant List */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />

        {/* Restaurant Details */}
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
            FAVOURITES
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
            FALLBACK
        ===================================================== */}
        <Route
          path="*"
          element={<SplashPage />}
        />

      </Route>
    </Routes>
  );
}
