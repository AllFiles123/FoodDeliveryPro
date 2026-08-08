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

import LocationPage from "../pages/Location/LocationPage";

import Favourite from "../pages/Favourite/Favourite";
import Map from "../pages/Map/Map";

import FoodDetails from "../pages/FoodDetails/FoodDetails";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Splash */}
        <Route
          path="/"
          element={<SplashPage />}
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />

        {/* Auth */}
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

        {/* Location */}
        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <LocationPage />
            </ProtectedRoute>
          }
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Search */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Favourite */}
        <Route
          path="/favorite"
          element={
            <ProtectedRoute>
              <Favourite />
            </ProtectedRoute>
          }
        />

        {/* Map */}
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map />
            </ProtectedRoute>
          }
        />

        {/* Restaurants */}
        <Route
          path="/restaurants"
          element={<RestaurantListPage />}
        />

        {/* Restaurant Details */}
        <Route
          path="/restaurants/:id"
          element={<RestaurantDetailsPage />}
        />

        {/* Category Foods */}
        <Route
          path="/restaurants/:id/category/:categoryName"
          element={<CategoryFoodsPage />}
        />

        {/* Food Details */}
        <Route
          path="/food/:id"
          element={
            <ProtectedRoute>
              <FoodDetails />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}

