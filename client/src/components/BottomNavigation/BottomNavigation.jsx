import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import {
  House,
  ShoppingCart,
  ClipboardList,
  User,
  Heart,
  MapPin,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const menus = [
  { name: "Home", path: "/home", icon: House },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Map", path: "/map", icon: MapPin }, // নতুন ম্যাপ আইকন
  { name: "Favorite", path: "/favorite", icon: Heart }, // নতুন ফেভারিট আইকন
  { name: "Cart", path: "/cart", icon: ShoppingCart },
  { name: "Profile", path: "/profile", icon: User },
];

export default function BottomNavigation() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Pill Shaped Container - ইমেজের মতো ডিজাইন */}
      <nav className="flex items-center gap-1 bg-[#0F1113] p-2 rounded-full shadow-2xl shadow-black/40 border border-white/5">
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink key={item.path} to={item.path}>
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full transition-all
                  ${isActive 
                    ? "bg-gradient-to-r from-[#FF2D55] to-[#D30030] text-white" 
                    : "text-gray-500 hover:text-gray-300"}
                `}
              >
                {/* Icon Container with Cart Badge logic */}
                <div className="relative flex items-center justify-center">
                  <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                  
                  {/* Cart Item Badge */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className={`
                      absolute -right-2.5 -top-2.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white
                      ${isActive ? "bg-[#0F1113]" : "bg-[#FF2D55]"}
                    `}>
                      {totalItems}
                    </span>
                  )}
                </div>

                {/* Active Text Label - ইমেজের মতো শুধুমাত্র একটিভ আইটেমে টেক্সট দেখাবে */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-xs font-black whitespace-nowrap overflow-hidden"
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

