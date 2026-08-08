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
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='18' fill='%23f5f5f5'/%3E%3Cpath d='M38 82h44M42 78l8-35h20l8 35M52 43l8-10 8 10' fill='none' stroke='%23d1d5db' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

const POSITION_KEY =
  "fooddeliverypro-floating-cart-position";

const TRIGGER_WIDTH = 132;
const TRIGGER_HEIGHT = 46;
const EDGE_GAP = 10;

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

  const getInitialPosition = React.useCallback(() => {
    if (typeof window === "undefined") {
      return {
        x: EDGE_GAP,
        y: 500,
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
      // Ignore invalid saved position.
    }

    return {
      x: window.innerWidth - TRIGGER_WIDTH - 14,
      y: window.innerHeight - 145,
    };
  }, []);

  const [position, setPosition] = React.useState(
    getInitialPosition
  );

  const dragRef = React.useRef({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    originalX: 0,
    originalY: 0,
  });

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

    const clampPosition = () => {
      setPosition((current) => {
        const maxX = Math.max(
          EDGE_GAP,
          window.innerWidth -
            TRIGGER_WIDTH -
            EDGE_GAP
        );

        const maxY = Math.max(
          EDGE_GAP,
          window.innerHeight -
            TRIGGER_HEIGHT -
            75
        );

        const next = {
          x: Math.min(
            Math.max(current.x, EDGE_GAP),
            maxX
          ),
          y: Math.min(
            Math.max(current.y, EDGE_GAP),
            maxY
          ),
        };

        localStorage.setItem(
          POSITION_KEY,
          JSON.stringify(next)
        );

        return next;
      });
    };

    window.addEventListener(
      "resize",
      clampPosition
    );

    return () => {
      window.removeEventListener(
        "resize",
        clampPosition
      );
    };
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.classList.add(
        "floating-cart-open"
      );
    } else {
      document.body.classList.remove(
        "floating-cart-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "floating-cart-open"
      );
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

  const handlePointerDown = (event) => {
    if (open) return;

    const point =
      event.touches?.[0] || event;

    dragRef.current = {
      dragging: true,
      moved: false,
      startX: point.clientX,
      startY: point.clientY,
      originalX: position.x,
      originalY: position.y,
    };

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag.dragging || open) return;

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
      EDGE_GAP,
      window.innerWidth -
        TRIGGER_WIDTH -
        EDGE_GAP
    );

    const maxY = Math.max(
      EDGE_GAP,
      window.innerHeight -
        TRIGGER_HEIGHT -
        75
    );

    const next = {
      x: Math.min(
        Math.max(
          drag.originalX + deltaX,
          EDGE_GAP
        ),
        maxX
      ),
      y: Math.min(
        Math.max(
          drag.originalY + deltaY,
          EDGE_GAP
        ),
        maxY
      ),
    };

    setPosition(next);
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;

    if (!drag.dragging) return;

    drag.dragging = false;

    if (drag.moved) {
      localStorage.setItem(
        POSITION_KEY,
        JSON.stringify(position)
      );

      event.preventDefault();
    }
  };

  const handleTriggerClick = (event) => {
    const drag = dragRef.current;

    if (drag.moved) {
      drag.moved = false;
      event.preventDefault();
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProceedToCart = () => {
    setOpen(false);
    navigate("/cart");
  };

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
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          EXPANDED CART
      ====================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.7,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              fixed
              left-3
              right-3
              bottom-[78px]
              z-[9990]
              mx-auto
              max-w-md
              overflow-hidden
              rounded-[26px]
              bg-gradient-to-br
              from-[#d90045]
              via-[#e4004f]
              to-[#c9003e]
              p-3
              text-white
              shadow-[0_20px_65px_rgba(190,0,55,0.35)]
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between px-2 py-1.5">

              <div className="flex items-center gap-2">

                <div className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/15
                ">
                  <ShoppingBag size={16} />
                </div>

                <div>
                  <div className="flex items-center gap-2">

                    <h2 className="text-[13px] font-black">
                      Your Cart
                    </h2>

                    <span className="
                      rounded-full
                      bg-white/15
                      px-1.5
                      py-0.5
                      text-[9px]
                      font-black
                    ">
                      {totalItems}
                    </span>

                  </div>

                  <p className="text-[8px] text-white/65">
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
                onClick={handleClose}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/10
                  active:scale-90
                "
                aria-label="Close cart"
              >
                <X size={15} />
              </button>

            </div>

            {/* ITEMS */}

            <div className="
              mt-1
              max-h-[250px]
              space-y-1.5
              overflow-y-auto
              pr-0.5
            ">

              <AnimatePresence initial={false}>

                {cart.map((item) => {
                  const itemName =
                    getItemName(item);

                  const itemImage =
                    getItemImage(item);

                  const itemPrice =
                    getItemPrice(item);

                  return (
                    <motion.div
                      key={item.id}
                      layout="position"
                      initial={{
                        opacity: 0,
                        x: 8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -8,
                      }}
                      transition={{
                        duration: 0.16,
                      }}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-white/10
                        bg-white/10
                        p-1.5
                      "
                    >

                      {/* SMALL SQUARE IMAGE */}

                      <div className="
                        h-10
                        w-10
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-white
                      ">
                        <img
                          src={itemImage}
                          alt={itemName}
                          draggable="false"
                          className="
                            block
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

                      <div className="
                        min-w-0
                        flex-1
                      ">

                        <p className="
                          truncate
                          text-[10px]
                          font-bold
                        ">
                          {itemName}
                        </p>

                        <p className="
                          mt-0.5
                          text-[8px]
                          text-white/60
                        ">
                          ৳{itemPrice.toFixed(2)} each
                        </p>

                        <div className="
                          mt-1
                          flex
                          items-center
                        ">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQty(item.id)
                            }
                            className="
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-md
                              bg-white/10
                              active:scale-90
                            "
                            aria-label={`Decrease ${itemName}`}
                          >
                            <Minus size={9} />
                          </button>

                          <span className="
                            mx-1.5
                            min-w-[12px]
                            text-center
                            text-[9px]
                            font-black
                          ">
                            {item.qty}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQty(item.id)
                            }
                            className="
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-md
                              bg-white
                              text-[#d90045]
                              active:scale-90
                            "
                            aria-label={`Increase ${itemName}`}
                          >
                            <Plus size={9} />
                          </button>

                        </div>

                      </div>

                      {/* PRICE + DELETE */}

                      <div className="
                        flex
                        flex-col
                        items-end
                        justify-center
                      ">

                        <p className="
                          text-[10px]
                          font-black
                        ">
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
                            mt-0.5
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-md
                            text-white/45
                            active:scale-90
                          "
                          aria-label={`Remove ${itemName}`}
                        >
                          <Trash2 size={12} />
                        </button>

                      </div>

                    </motion.div>
                  );
                })}

              </AnimatePresence>

            </div>

            {/* DISCOUNT PROGRESS */}

            <div className="
              mt-2.5
              rounded-xl
              border
              border-white/10
              bg-white/10
              px-2.5
              py-2.5
            ">

              <div className="
                flex
                items-center
                justify-between
                gap-2
              ">

                <p className="
                  min-w-0
                  truncate
                  text-[9px]
                  font-semibold
                  text-white/90
                ">
                  {totalPrice >= TARGET_AMOUNT
                    ? "10% discount unlocked"
                    : `৳${totalPrice.toFixed(
                        0
                      )} / ৳${TARGET_AMOUNT} — ৳${remainingAmount.toFixed(
                        0
                      )} more`}
                </p>

                <span className="
                  shrink-0
                  text-[9px]
                  font-black
                ">
                  {Math.min(
                    totalPrice,
                    TARGET_AMOUNT
                  ).toFixed(0)}
                  /{TARGET_AMOUNT}
                </span>

              </div>

              <div className="
                mt-1.5
                h-1
                overflow-hidden
                rounded-full
                bg-white/15
              ">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${progressPercent}%`,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-white
                  "
                />
              </div>

              <p className="
                mt-1
                text-[7px]
                text-white/50
              ">
                Add products worth ৳2000 to get 10% off.
              </p>

            </div>

            {/* TOTAL */}

            <div className="
              mt-2.5
              flex
              items-center
              justify-between
              px-1.5
            ">

              <span className="
                text-[9px]
                font-medium
                text-white/60
              ">
                {discountAmount > 0
                  ? "Total after discount"
                  : "Cart total"}
              </span>

              <span className="
                text-[14px]
                font-black
              ">
                ৳{finalPrice.toFixed(2)}
              </span>

            </div>

            {/* PROCEED TO CART */}

            <button
              type="button"
              onClick={handleProceedToCart}
              className="
                mt-2.5
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                bg-white
                px-3.5
                py-3
                text-[#a9003b]
                shadow-md
                active:scale-[0.985]
              "
            >

              <span className="
                text-[10px]
                font-black
              ">
                Proceed to Cart
              </span>

              <div className="
                flex
                items-center
                gap-1
              ">
                <span className="
                  text-[9px]
                  font-bold
                ">
                  ৳{finalPrice.toFixed(2)}
                </span>

                <ChevronRight size={14} />
              </div>

            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          COMPACT DRAGGABLE CART
          DOES NOT OPEN AUTOMATICALLY
      ====================================================== */}

      {!open && (
        <motion.button
          type="button"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            x: position.x,
            y: position.y,
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 500,
              damping: 38,
              mass: 0.45,
            },
            y: {
              type: "spring",
              stiffness: 500,
              damping: 38,
              mass: 0.45,
            },
            opacity: {
              duration: 0.18,
            },
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleTriggerClick}
          className="
            fixed
            left-0
            top-0
            z-[9970]
            flex
            h-[46px]
            w-[132px]
            touch-none
            select-none
            items-center
            gap-2
            rounded-2xl
            bg-[#d90045]
            px-2.5
            text-white
            shadow-[0_8px_28px_rgba(190,0,55,0.30)]
            ring-1
            ring-white/70
            outline-none
            active:scale-[0.98]
          "
          style={{
            willChange: "transform",
          }}
          aria-label="Open cart"
        >

          {/* ICON */}

          <div className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white/15
          ">
            <ShoppingBag size={17} />
          </div>

          {/* TEXT */}

          <div className="
            min-w-0
            flex-1
            text-left
          ">

            <p className="
              truncate
              text-[9px]
              font-bold
              leading-none
            ">
              View Cart
            </p>

            <p className="
              mt-1
              truncate
              text-[8px]
              font-medium
              leading-none
              text-white/65
            ">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              • ৳{totalPrice.toFixed(0)}
            </p>

          </div>

          {/* COUNT */}

          <span className="
            flex
            h-6
            min-w-6
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-white
            px-1
            text-[8px]
            font-black
            text-[#d90045]
          ">
            {totalItems > 99
              ? "99+"
              : totalItems}
          </span>

        </motion.button>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .floating-cart-open {
              overscroll-behavior: none;
            }

            @media (max-width: 380px) {
              .floating-cart-trigger {
                width: 122px;
              }
            }
          `,
        }}
      />
    </>
  );
}
