import { motion } from "framer-motion";
import {
  Home,
  PlayCircle,
  ClipboardList,
  Heart,
  Map,
  UserRound,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/home",
      match: (pathname) => pathname === "/home",
    },
    {
      id: "video",
      label: "Video",
      icon: PlayCircle,
      path: "/explore-reels",
      match: (pathname) =>
        pathname === "/explore-reels",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ClipboardList,
      path: "/orders",
      match: (pathname) =>
        pathname === "/orders",
    },
    {
      id: "favourite",
      label: "Favourite",
      icon: Heart,
      path: "/favourite",
      match: (pathname) =>
        pathname === "/favourite",
    },
    {
      id: "map",
      label: "Map",
      icon: Map,
      path: "/map",
      match: (pathname) =>
        pathname === "/map",
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
      path: "/profile",
      match: (pathname) =>
        pathname === "/profile",
    },
  ];

  const activeItem =
    navItems.find((item) =>
      item.match(location.pathname)
    ) || navItems[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-3 pb-[12px]">
      <nav
        aria-label="Bottom navigation"
        className="
          pointer-events-auto
          flex
          w-full
          max-w-[430px]
          items-center
          justify-between
          gap-1
          rounded-[34px]
          border-[5px]
          border-[#D9D9D9]
          bg-[#D9D9D9]
          p-1.5
          shadow-[0_10px_35px_rgba(0,0,0,0.16)]
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeItem.id === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() =>
                navigate(item.path)
              }
              className={`
                relative
                flex
                h-[52px]
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                transition-all
                duration-300
                ${
                  isActive
                    ? "min-w-[88px] bg-[#F04438] px-3 text-white shadow-sm"
                    : "w-[52px] bg-[#F8F8F8] text-[#555555]"
                }
              `}
              aria-label={item.label}
              aria-current={
                isActive ? "page" : undefined
              }
            >
              <Icon
                size={21}
                strokeWidth={2.1}
                className="shrink-0"
              />

              {isActive && (
                <motion.span
                  initial={{
                    opacity: 0,
                    width: 0,
                    marginLeft: 0,
                  }}
                  animate={{
                    opacity: 1,
                    width: "auto",
                    marginLeft: 7,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    whitespace-nowrap
                    text-[12px]
                    font-bold
                  "
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
