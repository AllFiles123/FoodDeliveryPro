import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  ClipboardList,
  User,
  Heart,
  MapPin,
} from "lucide-react";

import { useFavourite } from "../../context/FavouriteContext";

const menus = [
  {
    name: "Home",
    path: "/home",
    icon: House,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Favorite",
    path: "/favourite",
    icon: Heart,
  },
  {
    name: "Map",
    path: "/map",
    icon: MapPin,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

export default function BottomNavigation() {
  const location = useLocation();
  const { favourites } = useFavourite();

  const favouriteCount =
    (favourites?.items?.length || 0) +
    (favourites?.restaurants?.length || 0);

  /*
   * Hide navigation on fullscreen pages.
   */
  const hiddenPaths = [
    "/checkout",
    "/profile/details",
    "/profile/payment",
  ];

  const shouldHide = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldHide) {
    return null;
  }

  /*
   * Active menu detection.
   */
  const isMenuActive = (path) => {
    if (path === "/profile") {
      return location.pathname === "/profile";
    }

    return location.pathname === path;
  };

  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-x-0
        bottom-0
        z-[9999]
        flex
        justify-center
        px-3
        pb-[max(0.75rem,env(safe-area-inset-bottom))]
      "
    >
      <nav
        aria-label="Bottom navigation"
        className="
          pointer-events-auto
          flex
          w-full
          max-w-md
          items-center
          justify-between
          gap-1
          rounded-[1.75rem]
          border
          border-white/10
          bg-[#1A1D24]/95
          px-2
          py-2
          shadow-[0_15px_45px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
        "
      >
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = isMenuActive(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.name}
              className="
                flex
                min-w-0
                flex-1
                justify-center
                outline-none
              "
            >
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className={`
                  relative
                  flex
                  min-h-[44px]
                  items-center
                  justify-center
                  gap-1.5
                  rounded-full
                  px-2
                  sm:px-3
                  transition-colors
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF3B30] to-[#E60023] text-white shadow-lg shadow-red-600/30"
                      : "text-gray-400 hover:text-gray-200"
                  }
                `}
              >
                <div className="relative flex shrink-0 items-center justify-center">
                  <Icon
                    size={isActive ? 18 : 21}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* FAVORITE BADGE */}
                  {item.name === "Favorite" &&
                    favouriteCount > 0 && (
                      <span
                        className={`
                          absolute
                          -right-2.5
                          -top-2.5
                          flex
                          h-5
                          min-w-5
                          items-center
                          justify-center
                          rounded-full
                          px-1
                          text-[9px]
                          font-black
                          leading-none
                          text-white
                          ring-2
                          ${
                            isActive
                              ? "bg-[#1A1D24] ring-[#E60023]"
                              : "bg-[#FF3B30] ring-[#1A1D24]"
                          }
                        `}
                      >
                        {favouriteCount > 99
                          ? "99+"
                          : favouriteCount}
                      </span>
                    )}
                </div>

                {/* ACTIVE LABEL */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        width: 0,
                      }}
                      animate={{
                        opacity: 1,
                        width: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                      className="
                        overflow-hidden
                        whitespace-nowrap
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.08em]
                      "
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
