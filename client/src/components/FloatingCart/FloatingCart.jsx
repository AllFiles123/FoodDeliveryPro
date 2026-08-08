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

const TRIGGER_WIDTH = 150;
const TRIGGER_HEIGHT = 52;

const POSITION_KEY =
  "fooddeliverypro-floating-cart-position";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='18' fill='%23f5f5f5'/%3E%3Cpath d='M38 82h44M42 78l8-35h20l8 35M52 43l8-10 8 10' fill='none' stroke='%23d1d5db' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

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

  /*
   * IMPORTANT:
   * Cart NEVER opens automatically when an item is added.
   * It only opens after the user taps the floating cart.
   */
  const [open, setOpen] = React.useState(false);

  /*
   * Floating cart position
   */
  const [position, setPosition] = React.useState(() => {
    if (typeof window === "undefined") {
      return {
        x: 16,
        y: 600,
      };
    }

    try {
      const saved = localStorage.getItem(POSITION_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          typeof parsed?.x === "number" &&
          typeof parsed?.y === "number"
        ) {
          return parsed;
        }
      }
    } catch {
      // Ignore invalid saved position
    }

    return {
      x: Math.max(
        12,
        window.innerWidth - TRIGGER_WIDTH - 14
      ),
      y: Math.max(
        90,
        window.innerHeight - 180
      ),
    };
  });

  const dragStartRef = React.useRef(null);

  /*
   * Pages where Floating Cart should not appear
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

  /*
   * Keep floating cart inside viewport
   */
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setPosition((previous) => {
        const maxX = Math.max(
          8,
          window.innerWidth -
            TRIGGER_WIDTH -
            8
        );

        const maxY = Math.max(
          70,
          window.innerHeight -
            TRIGGER_HEIGHT -
            8
        );

        const next = {
          x: Math.min(
            Math.max(previous.x, 8),
            maxX
          ),
          y: Math.min(
            Math.max(previous.y, 70),
            maxY
          ),
        };

        try {
          localStorage.setItem(
            POSITION_KEY,
            JSON.stringify(next)
          );
        } catch {
          // Ignore storage errors
        }

        return next;
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
   * Lock background scrolling while expanded
   */
  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /*
   * Close floating cart if route changes
   */
  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /*
   * Helpers
   */
  const getItemName = (item) =>
    item?.name ||
    item?.title ||
    item?.dish ||
    "Food Item";

  const getItemImage = (item) =>
    item?.image ||
    item?.thumbnail ||
    item?.imageUrl ||
    fallbackImage;

  const getItemPrice = (item) =>
    Number(item?.price || 0);

  /*
   * Discount calculation
   */
  const safeTotalPrice = Number(totalPrice || 0);

  const remainingAmount = Math.max(
    TARGET_AMOUNT - safeTotalPrice,
    0
  );

  const progressPercent = Math.min(
    (safeTotalPrice / TARGET_AMOUNT) * 100,
    100
  );

  const discountAmount =
    safeTotalPrice >= TARGET_AMOUNT
      ? (safeTotalPrice * DISCOUNT_PERCENT) / 100
      : 0;

  const finalPrice =
    safeTotalPrice - discountAmount;

  /*
   * Proceed to Cart
   */
  const handleProceedToCart = () => {
    setOpen(false);
    navigate("/cart");
  };

  /*
   * DRAG START
   */
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

  /*
   * DRAG MOVE
   */
  const handleDragMove = (event) => {
    const drag = dragStartRef.current;

    if (!drag || open) return;

    const deltaX =
      event.clientX - drag.startX;

    const deltaY =
      event.clientY - drag.startY;

    if (
      Math.abs(deltaX) > 5 ||
      Math.abs(deltaY) > 5
    ) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    const maxX = Math.max(
      8,
      window.innerWidth -
        TRIGGER_WIDTH -
        8
    );

    const maxY = Math.max(
      70,
      window.innerHeight -
        TRIGGER_HEIGHT -
        8
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
        70
      ),
      maxY
    );

    setPosition({
      x: nextX,
      y: nextY,
    });
  };

  /*
   * DRAG END
   */
  const handleDragEnd = (event) => {
    const drag = dragStartRef.current;

    if (!drag) return;

    try {
      event.currentTarget.releasePointerCapture?.(
        drag.pointerId
      );
    } catch {
      // Ignore pointer release errors
    }

    if (drag.moved) {
      /*
       * Save the latest position directly from state
       * after drag.
       */
      setPosition((current) => {
        try {
          localStorage.setItem(
            POSITION_KEY,
            JSON.stringify(current)
          );
        } catch {
          // Ignore storage errors
        }

        return current;
      });
    }

    /*
     * Keep the drag state alive until click is finished.
     * This prevents drag -> accidental open.
     */
    window.setTimeout(() => {
      dragStartRef.current = null;
    }, 0);
  };

  /*
   * FLOATING CART CLICK
   *
   * This is the ONLY place where setOpen(true)
   * happens.
   *
   * Therefore adding an item cannot automatically
   * open the cart.
   */
  const handleFloatingClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const drag = dragStartRef.current;

    if (drag?.moved) {
      return;
    }

    setOpen(true);
  };

  /*
   * Do not render when hidden / empty
   */
  if (hidden || cart.length === 0) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          BACKDROP
      ====================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
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
              y: 28,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 28,
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 30,
              mass: 0.8,
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
              from-orange-400
              via-orange-500
              to-orange-400
              p-3
              text-white
              shadow-[0_20px_70px_rgba(249,115,22,0.28)]
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}

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

                  <p className="mt-0.5 text-[9px] text-white/75">
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
                onClick={() =>
                  setOpen(false)
                }
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

            {/* =================================================
                ITEMS
            ================================================== */}

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

                const itemTotal =
                  itemPrice *
                  Number(item.qty || 0);

                return (
                  <motion.div
                    layout
                    key={item.id}
                    transition={{
                      layout: {
                        duration: 0.2,
                      },
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/15
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
                        draggable="false"
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

                      <p className="mt-0.5 text-[10px] text-white/70">
                        ৳{itemPrice.toFixed(2)} each
                      </p>

                      {/* QUANTITY */}

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
                            transition
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
                            text-orange-500
                            transition
                            active:scale-90
                          "
                          aria-label={`Increase ${itemName}`}
                        >
                          <Plus size={11} />
                        </button>

                      </div>

                    </div>

                    {/* PRICE + REMOVE */}

                    <div className="flex flex-col items-end">

                      <p className="text-[11px] font-black">
                        ৳{itemTotal.toFixed(2)}
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
                          text-white/60
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

            {/* =================================================
                DISCOUNT PROGRESS
            ================================================== */}

            <div
              className="
                mt-3
                rounded-2xl
                border
                border-white/15
                bg-white/10
                px-3
                py-3
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-[10px] font-semibold text-white/95">

                  {safeTotalPrice >= TARGET_AMOUNT
                    ? "10% discount unlocked"
                    : `Add ৳${remainingAmount.toFixed(
                        0
                      )} more for 10% off`}

                </p>

                <span className="text-[10px] font-black">

                  ৳
                  {Math.min(
                    safeTotalPrice,
                    TARGET_AMOUNT
                  ).toFixed(0)}

                  /
                  {TARGET_AMOUNT}

                </span>

              </div>

              {/* PROGRESS BAR */}

              <div
                className="
                  mt-2
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-white/20
                "
              >

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${progressPercent}%`,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-white
                  "
                />

              </div>

              <p className="mt-1.5 text-[8px] text-white/65">

                {safeTotalPrice >= TARGET_AMOUNT
                  ? "You unlocked 10% discount on your cart."
                  : `Add products worth ৳${remainingAmount.toFixed(
                      0
                    )} more to unlock 10% discount.`}

              </p>

            </div>

            {/* =================================================
                SUBTOTAL
            ================================================== */}

            <div className="mt-3 flex items-center justify-between px-2">

              <span className="text-[10px] font-medium text-white/70">
                Subtotal
              </span>

              <span className="text-base font-black">
                ৳{safeTotalPrice.toFixed(2)}
              </span>

            </div>

            {/* =================================================
                DISCOUNT
            ================================================== */}

            {discountAmount > 0 && (
              <div className="mt-1 flex items-center justify-between px-2">

                <span className="text-[10px] font-medium text-white/70">
                  10% Discount
                </span>

                <span className="text-[11px] font-black">
                  -৳{discountAmount.toFixed(2)}
                </span>

              </div>
            )}

            {/* =================================================
                PROCEED TO CART
            ================================================== */}

            <button
              type="button"
              onClick={handleProceedToCart}
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
                text-orange-600
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
          NEVER VISIBLE WHEN CART IS OPEN
      ====================================================== */}

      {!open && (
        <motion.button
          type="button"
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: position.x,
            y: position.y,
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
            mass: 0.7,
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
            h-[52px]
            w-[150px]
            touch-none
            select-none
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-orange-400
            to-orange-500
            text-white
            shadow-[0_10px_30px_rgba(249,115,22,0.28)]
            ring-1
            ring-white/80
            transition-transform
            active:scale-[0.97]
          "
          aria-label="Open cart"
        >

          <ShoppingBag
            size={21}
            strokeWidth={2.2}
          />

          <span className="text-[11px] font-black">
            View Cart
          </span>

          {/* =================================================
              BADGE — TOP, NOT SIDE
          ================================================== */}

          <span
            className="
              absolute
              -right-1.5
              -top-2
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-white
              px-1.5
              text-[9px]
              font-black
              text-orange-500
              shadow-md
              ring-2
              ring-orange-300
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
