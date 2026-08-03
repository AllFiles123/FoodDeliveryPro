import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import SplashPage from "../pages/Splash/SplashPage";
import OnboardingPage from "../pages/Onboarding/OnboardingPage";

import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import OtpVerificationPage from "../pages/Auth/OtpVerificationPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

import ProfilePage from "../pages/Profile/ProfilePage";
import RestaurantListPage from "../pages/Restaurant/RestaurantListPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public Routes */}

        <Route
          path="/"
          element={<SplashPage />}
        />

        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/otp"
          element={<OtpVerificationPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />



        {/* Protected Routes */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/restaurants"
          element={
            <RestaurantListPage />
          }
        />


        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div />
            </ProtectedRoute>
          }
        />


      </Route>
    </Routes>
  );
}
