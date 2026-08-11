import {
  Outlet,
  useLocation,
} from "react-router-dom";

import BottomNavigation from "../components/BottomNavigation/BottomNavigation";
import FloatingCart from "../components/FloatingCart/FloatingCart";

export default function MainLayout() {
  const location = useLocation();

  const pathname =
    location.pathname;

  /*
   * ============================================================
   * BOTTOM NAVIGATION VISIBILITY
   * ============================================================
   *
   * Preserve existing hidden routes and extend them for:
   *
   * - Restaurant pages
   * - Home "See All" pages
   * - Profile sub-pages
   * - Food details
   *
   * Main Profile page itself still shows the navigation.
   */

  const hideBottomNavigation = (() => {
    /*
     * ----------------------------------------------------------
     * APP ENTRY / AUTH / LOCATION
     * ----------------------------------------------------------
     */

    const hiddenExactRoutes = [
      "/",
      "/onboarding",
      "/language",
      "/location",

      "/login",
      "/signup",
      "/forgot-password",
      "/otp",
      "/reset-password",

      /*
       * Existing profile sub-pages
       */
      "/profile/details",
      "/profile/payment",

      /*
       * Cart / checkout
       */
      "/cart",
      "/checkout",

      /*
       * Food details
       */
      "/food",
    ];

    if (
      hiddenExactRoutes.includes(
        pathname
      )
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * PROFILE
     *
     * /profile       => SHOW
     * /profile/...   => HIDE
     * ----------------------------------------------------------
     */

    if (
      pathname.startsWith("/profile/")
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * RESTAURANTS
     *
     * Restaurant list + restaurant details
     * should not show bottom navigation.
     * ----------------------------------------------------------
     */

    if (
      pathname === "/restaurants" ||
      pathname.startsWith("/restaurants/")
    ) {
      return true;
    }

    /*
     * Backward-compatible old route
     */
    if (
      pathname.startsWith("/restaurant/")
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * CATEGORY EXPLORE / SEE ALL
     * ----------------------------------------------------------
     */

    if (
      pathname === "/category-explore" ||
      pathname.startsWith(
        "/category-explore/"
      )
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * POPULAR ITEMS SEE ALL
     * ----------------------------------------------------------
     */

    if (
      pathname === "/popular-items" ||
      pathname.startsWith(
        "/popular-items/"
      )
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * FEATURED ITEMS SEE ALL
     * ----------------------------------------------------------
     */

    if (
      pathname === "/featured-items" ||
      pathname.startsWith(
        "/featured-items/"
      )
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * BRANDS SEE ALL
     * ----------------------------------------------------------
     */

    if (
      pathname === "/brands" ||
      pathname.startsWith("/brands/")
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * FOOD DETAILS
     *
     * /food/:id
     * ----------------------------------------------------------
     */

    if (
      pathname.startsWith("/food/")
    ) {
      return true;
    }

    /*
     * ----------------------------------------------------------
     * DEFAULT
     *
     * Home / Search / Favourite / Orders /
     * Explore Reels / Profile etc.
     * ----------------------------------------------------------
     */

    return false;
  })();

  return (
    <div className="relative min-h-screen">
      <Outlet />

      {/* =====================================================
          ORIGINAL FLOATING CART
          
          Cart functionality remains completely untouched.
          This is the existing production FloatingCart component.
      ===================================================== */}

      <FloatingCart />

      {!hideBottomNavigation && (
        <BottomNavigation />
      )}
    </div>
  );
}
