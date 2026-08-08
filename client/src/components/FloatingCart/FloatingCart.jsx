import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const TARGET_AMOUNT = 2000;
const DISCOUNT_PERCENT = 10;

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

  const [position, setPosition] = React.useState(() => {
    if (typeof window === "undefined") {
      return {
        x: 16,
        y: window?.innerHeight
          ? window.innerHeight - 180
          : 600,
      };
    }

    const saved = localStorage.getItem(
      "fooddeliverypro-floating-cart-position"
    );

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (
          typeof parsed?.x === "number" &&
          typeof parsed?.y === "number"
        ) {
          return parsed;
        }
      } catch {
        // Ignore invalid saved position
      }
    }

    return {
      x: window.innerWidth - 76,
      y: window.innerHeight - 180,
    };
  });

  const dragStartRef = React.useRef(null);

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

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setPosition((prev) => {
        const maxX = Math.max(8, window.innerWidth - 68);
        const maxY = Math.max(80, window.innerHeight - 68);

        const next = {
          x: Math.min(Math.max(prev.x, 8), maxX),
          y: Math.min(Math.max(prev.y, 80), maxY),
        };

        localStorage.setItem(
          "fooddeliverypro-floating-cart-position",
          JSON.stringify(next)
        );

        return next;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  const remainingAmount = Math.max(
    TARGET_AMOUNT - totalPrice,
    0
  );

  const progressPercent = Math.min(
    (totalPrice / TARGET_AMOUNT) * 100,
    100
  );

  const discountAmount =
    totalPrice >= TARGET_AMOUNT
      ? (totalPrice * DISCOUNT_PERCENT) / 100
      : 0;

  const finalPrice =
    totalPrice - discountAmount;

  const handleCheckout = () => {
    setOpen(false);
    navigate("/cart");
  };

  const handleDragStart = (event) => {
    if (open) return;

    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originalX: position.x,
      originalY: position.y,
      moved: false,
    };

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );
  };

  const handleDragMove = (event) => {
    const drag = dragStartRef.current;

    if (!drag || open) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (
      Math.abs(deltaX) > 4 ||
      Math.abs(deltaY) > 4
    ) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    const maxX = Math.max(
      8,
      window.innerWidth - 68
    );

    const maxY = Math.max(
      80,
      window.innerHeight - 68
    );

    const nextX = Math.min(
      Math.max(
        drag.originalX + deltaX,
        8
      ),
      maxX
    );

    const nextY = Math.min(
      Math.max(
        drag.originalY + deltaY,
        80
      ),
      maxY
    );

    setPosition({
      x: nextX,
      y: nextY,
    });
  };

  const handleDragEnd = () => {
    const drag = dragStartRef.current;

    if (!drag) return;

    if (drag.moved) {
      localStorage.setItem(
        "fooddeliverypro-floating-cart-position",
        JSON.stringify(position)
      );
    }

    dragStartRef.current = null;
  };

  const handleFloatingClick = () => {
    const drag = dragStartRef.current;

    if (drag?.moved) {
      return;
    }

    setOpen(true);
  };

  if (hidden || cart.length === 0) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          EXPANDED CART BACKDROP
      ====================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[9980]
              bg-black/20
              backdrop-blur-[2px]
            "
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          EXPANDED CART PANEL
      ====================================================== */}

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
            onClick={(event) =>
              event.stopPropagation()
            }
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

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                  "
                >
                  <ShoppingBag size={18} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-sm font-black">
                      Your Cart
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-white/15
                        px-2
                        py-0.5
                        text-[10px]
                        font-bold
                      "
                    >
                      {totalItems}
                    </span>

                  </div>

                  <p className="mt-0.5 text-[9px] text-white/70">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    in your cart
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

            <div
              className="
                mt-1
                max-h-[270px]
                space-y-2
                overflow-y-auto
                pr-1
              "
            >

              {cart.map((item) => {

                const itemName =
                  getItemName(item);

                const itemImage =
                  getItemImage(item);

                const itemPrice =
                  getItemPrice(item);

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

                    <div
                      className="
                        h-12
                        w-12
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-white
                      "
                    >

                      <img
                        src={itemImage}
                        alt={itemName}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
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

                        <span
                          className="
                            mx-2
                            min-w-[14px]
                            text-center
                            text-[10px]
                            font-black
                          "
                        >
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

                    {/* PRICE + REMOVE ICON */}

                    <div className="flex flex-col items-end">

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
                        className="
                          mt-1
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-lg
                          text-white/50
                          transition
                          hover:bg-white/10
                          hover:text-white
                          active:scale-90
                        "
                        aria-label={`Remove ${itemName}`}
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </motion.div>
                );
              })}

            </div>

            {/* DISCOUNT PROGRESS */}

            <div
              className="
                mt-3
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-3
                py-3
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-[10px] font-semibold text-white/90">

                  {totalPrice >= TARGET_AMOUNT
                    ? "10% discount unlocked"
                    : `Add ৳${remainingAmount.toFixed(
                        0
                      )} more for 10% off`}

                </p>

                <span className="text-[10px] font-black">
                  {Math.min(
                    totalPrice,
                    TARGET_AMOUNT
                  ).toFixed(0)}
                  /{TARGET_AMOUNT}
                </span>

              </div>

              <div
                className="
                  mt-2
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-white/15
                "
              >

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${progressPercent}%`,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-white
                  "
                />

              </div>

              <p className="mt-1.5 text-[8px] text-white/55">
                Add products worth ৳{TARGET_AMOUNT} to
                unlock {DISCOUNT_PERCENT}% discount.
              </p>

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

            {/* DISCOUNT */}

            {discountAmount > 0 && (
              <div className="mt-1 flex items-center justify-between px-2">

                <span className="text-[10px] font-medium text-white/65">
                  10% Discount
                </span>

                <span className="text-[11px] font-black">
                  -৳{discountAmount.toFixed(2)}
                </span>

              </div>
            )}

            {/* PROCEED TO CART */}

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
                Proceed to Cart
              </span>

              <div className="flex items-center gap-1">

                <span className="text-[10px] font-bold">

                  ৳{finalPrice.toFixed(2)}

                </span>

                <ChevronRight size={16} />

              </div>

            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          SMALL DRAGGABLE FLOATING CART
          HIDDEN COMPLETELY WHEN CART IS OPEN
      ====================================================== */}

      {!open && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: position.x,
            y: position.y,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 28,
          }}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onClick={handleFloatingClick}
          className="
            fixed
            left-0
            top-0
            z-[9970]
            flex
            h-14
            w-14
            touch-none
            select-none
            items-center
            justify-center
            rounded-full
            bg-[#d90045]
            text-white
            shadow-[0_10px_35px_rgba(190,0,55,0.35)]
            ring-2
            ring-white/80
            transition-transform
            active:scale-95
          "
          aria-label="Open cart"
        >

          <ShoppingBag size={22} />

          {/* ITEM COUNT */}

          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-white
              px-1
              text-[9px]
              font-black
              text-[#d90045]
              shadow-sm
            "
          >
            {totalItems > 99
              ? "99+"
              : totalItems}
          </span>

        </motion.button>
      )}

    </>
  );
}
