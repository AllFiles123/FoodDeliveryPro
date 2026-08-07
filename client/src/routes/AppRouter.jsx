import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import SplashPage from "../pages/Splash/SplashPage";
import OnboardingPage from "../pages/Onboarding/OnboardingPage";

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

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<SplashPage />} />

        <Route path="/onboarding" element={<OnboardingPage />} />

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

        <Route path="/otp" element={<OtpVerificationPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorite"
          element={
            <ProtectedRoute>
              <Favourite />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        <Route path="/restaurants" element={<RestaurantListPage />} />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetailsPage />}
        />

        <Route
          path="/restaurants/:id/category/:categoryName"
          element={<CategoryFoodsPage />}
        />
      </Route>
    </Routes>
  );
}
