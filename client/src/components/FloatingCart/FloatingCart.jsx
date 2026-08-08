import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%23f5f5f5'/%3E%3Cpath d='M38 82h44M42 78l8-35h20l8 35M52 43l8-10 8 10' fill='none' stroke='%23d1d5db' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

export default function FloatingCart() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cart,
    totalItems,
    totalPrice,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const [open, setOpen] = React.useState(false);

  /*
   * Floating cart should not appear on the dedicated
   * Cart or Checkout pages.
   */
  const hidden =
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/otp") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/" ||
    location.pathname.startsWith("/onboarding");

  if (hidden || cart.length === 0) {
    return null;
  }

  const previewItems = cart.slice(-2);

  const getItemName = (item) =>
    item.name ||
    item.title ||
    item.dish ||
    "Food Item";

  const getItemImage = (item) =>
    item.image ||
    item.thumbnail ||
    item.imageUrl ||
    fallbackImage;

  const getItemPrice = (item) =>
    Number(item.price || 0);

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* =========================================
          EXPANDED CART BACKDROP
      ========================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9980] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* =========================================
          CART PANEL
      ========================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 30,
            }}
            onClick={(event) => event.stopPropagation()}
            className="
              fixed
              bottom-[82px]
              left-4
              right-4
              z-[9990]
              mx-auto
              max-w-md
              overflow-hidden
              rounded-[28px]
              bg-gradient-to-br
              from-[#d90045]
              via-[#e4004f]
              to-[#c9003e]
              p-3
              text-white
              shadow-[0_20px_70px_rgba(190,0,55,0.35)]
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between px-3 py-2">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <ShoppingBag size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black">
                      Your Cart
                    </h2>

                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                      {totalItems}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[9px] text-white/70">
                    {totalItems}{" "}
                    {totalItems === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  active:scale-90
                "
                aria-label="Close cart"
              >
                <X size={17} />
              </button>

            </div>

            {/* ITEMS */}

            <div className="mt-1 max-h-[270px] space-y-2 overflow-y-auto pr-1">

              {cart.map((item) => {

                const itemName = getItemName(item);
                const itemImage = getItemImage(item);
                const itemPrice = getItemPrice(item);

                return (
                  <motion.div
                    layout
                    key={item.id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/10
                      p-2
                    "
                  >

                    {/* IMAGE */}

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">

                      <img
                        src={itemImage}
                        alt={itemName}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            fallbackImage;
                        }}
                      />

                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-[11px] font-bold">
                        {itemName}
                      </p>

                      <p className="mt-0.5 text-[10px] text-white/60">
                        ৳{itemPrice.toFixed(2)} each
                      </p>

                      <div className="mt-1.5 flex items-center">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQty(item.id)
                          }
                          className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-white/10
                            active:scale-90
                          "
                          aria-label={`Decrease ${itemName}`}
                        >
                          <Minus size={11} />
                        </button>

                        <span className="mx-2 min-w-[14px] text-center text-[10px] font-black">
                          {item.qty}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQty(item.id)
                          }
                          className="
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-[#d90045]
                            active:scale-90
                          "
                          aria-label={`Increase ${itemName}`}
                        >
                          <Plus size={11} />
                        </button>

                      </div>

                    </div>

                    {/* PRICE */}

                    <div className="text-right">

                      <p className="text-[11px] font-black">
                        ৳{(
                          itemPrice * item.qty
                        ).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="mt-1 text-[9px] text-white/50 transition hover:text-white"
                      >
                        Remove
                      </button>

                    </div>

                  </motion.div>
                );
              })}

            </div>

            {/* DELIVERY STATUS */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-3
                py-2.5
              "
            >

              <Truck size={16} className="shrink-0" />

              <div className="min-w-0 flex-1">

                <p className="text-[10px] font-semibold text-white/90">
                  Checking free delivery eligibility...
                </p>

                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    initial={{ width: "15%" }}
                    animate={{ width: "65%" }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="h-full rounded-full bg-white/70"
                  />
                </div>

              </div>

            </div>

            {/* SUBTOTAL */}

            <div className="mt-3 flex items-center justify-between px-2">

              <span className="text-[10px] font-medium text-white/65">
                Subtotal
              </span>

              <span className="text-base font-black">
                ৳{totalPrice.toFixed(2)}
              </span>

            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              onClick={handleCheckout}
              className="
                mt-3
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                bg-white
                px-4
                py-3.5
                text-[#a9003b]
                shadow-lg
                transition-all
                active:scale-[0.98]
              "
            >

              <span className="text-[11px] font-black">
                Proceed to Checkout
              </span>

              <div className="flex items-center gap-1">

                <span className="text-[10px] font-bold">
                  ৳{totalPrice.toFixed(2)}
                </span>

                <ChevronRight size={16} />

              </div>

            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          FLOATING CART BAR
      ========================================== */}

      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.9,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 28,
            }}
            className="
              fixed
              bottom-[82px]
              left-4
              right-4
              z-[9990]
              mx-auto
              max-w-md
            "
          >

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-full
                bg-gradient-to-r
                from-[#d90045]
                to-[#ed0055]
                px-3
                py-2.5
                text-white
                shadow-[0_12px_35px_rgba(217,0,69,0.35)]
                transition-all
                active:scale-[0.98]
              "
            >

              {/* PRODUCT PREVIEW */}

              <div className="flex -space-x-2">

                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="
                      h-10
                      w-10
                      overflow-hidden
                      rounded-full
                      border-2
                      border-[#d90045]
                      bg-white
                      shadow-sm
                    "
                  >
                    <img
                      src={getItemImage(item)}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          fallbackImage;
                      }}
                    />
                  </div>
                ))}

              </div>

              {/* TEXT */}

              <div className="min-w-0 flex-1 text-left">

                <div className="flex items-center gap-1.5">

                  <span className="text-[12px] font-black">
                    View cart
                  </span>

                  <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold">
                    {totalItems}
                  </span>

                </div>

                <p className="truncate text-[9px] text-white/65">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"} · ৳
                  {totalPrice.toFixed(2)}
                </p>

              </div>

              {/* ARROW */}

              <div className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white/10
                transition-transform
                group-active:translate-x-1
              ">
                <ChevronRight size={18} />
              </div>

            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
