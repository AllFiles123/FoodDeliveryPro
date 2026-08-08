import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  X,
  Trash2,
  Tag,
  GripVertical,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%23f5f5f5'/%3E%3Cpath d='M38 82h44M42 78l8-35h20l8 35M52 43l8-10 8 10' fill='none' stroke='%23d1d5db' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

const DISCOUNT_THRESHOLD = 2000;
const DISCOUNT_PERCENT = 10;

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
    try {
      const saved = localStorage.getItem(
        "fooddeliverypro-floating-cart-position"
      );

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error(error);
    }

    return {
      x: 0,
      y: 0,
    };
  });

  const [isDragging, setIsDragging] = React.useState(false);

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
    try {
      localStorage.setItem(
        "fooddeliverypro-floating-cart-position",
        JSON.stringify(position)
      );
    } catch (error) {
      console.error(error);
    }
  }, [position]);

  React.useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.max(
          Math.min(prev.x, window.innerWidth * 0.35),
          -window.innerWidth * 0.35
        ),
        y: Math.max(
          Math.min(prev.y, window.innerHeight * 0.35),
          -window.innerHeight * 0.35
        ),
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (hidden || cart.length === 0) {
    return null;
  }

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

  const discountUnlocked =
    totalPrice >= DISCOUNT_THRESHOLD;

  const amountRemaining = Math.max(
    DISCOUNT_THRESHOLD - totalPrice,
    0
  );

  const progressPercentage = Math.min(
    (totalPrice / DISCOUNT_THRESHOLD) * 100,
    100
  );

  const discountAmount = discountUnlocked
    ? (totalPrice * DISCOUNT_PERCENT) / 100
    : 0;

  const finalSubtotal = Math.max(
    totalPrice - discountAmount,
    0
  );

  const handleCart = () => {
    setOpen(false);
    navigate("/cart");
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);

    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
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
          EXPANDED CART PANEL
      ========================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 25,
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
              bottom-[90px]
              left-3
              right-3
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
              shadow-[0_20px_70px_rgba(190,0,55,0.35)]
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between px-2 py-2">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <ShoppingBag size={16} />
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
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  active:scale-90
                "
                aria-label="Close cart"
              >
                <X size={16} />
              </button>

            </div>

            {/* ITEMS */}

            <div className="mt-1 max-h-[250px] space-y-2 overflow-y-auto pr-1">

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
                      gap-2.5
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/10
                      p-2
                    "
                  >

                    {/* IMAGE */}

                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">

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

                      <p className="mt-0.5 text-[9px] text-white/60">
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
                          <Minus size={10} />
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
                          <Plus size={10} />
                        </button>

                      </div>

                    </div>

                    {/* PRICE + REMOVE ICON */}

                    <div className="flex shrink-0 flex-col items-end justify-between self-stretch">

                      <p className="text-[10px] font-black">
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
                          mt-auto
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-white/10
                          text-white/70
                          transition
                          hover:bg-white/20
                          hover:text-white
                          active:scale-90
                        "
                        aria-label={`Remove ${itemName}`}
                      >
                        <Trash2 size={13} />
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
                py-2.5
              "
            >

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  {discountUnlocked ? (
                    <Tag size={14} />
                  ) : (
                    <Truck size={14} />
                  )}
                </div>

                <div className="min-w-0 flex-1">

                  {discountUnlocked ? (
                    <>
                      <div className="flex items-center justify-between gap-2">

                        <p className="text-[10px] font-bold text-white">
                          10% discount unlocked
                        </p>

                        <span className="text-[9px] font-black text-white">
                          ৳{discountAmount.toFixed(0)} OFF
                        </span>

                      </div>

                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: 0.5,
                          }}
                          className="h-full rounded-full bg-white"
                        />

                      </div>

                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">

                        <p className="text-[10px] font-bold text-white/90">
                          Add ৳{amountRemaining.toFixed(0)} more
                        </p>

                        <span className="shrink-0 text-[9px] font-bold text-white/70">
                          ৳{totalPrice.toFixed(0)} / ৳2,000
                        </span>

                      </div>

                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${progressPercentage}%`,
                          }}
                          transition={{
                            duration: 0.5,
                          }}
                          className="h-full rounded-full bg-white/90"
                        />

                      </div>
                    </>
                  )}

                </div>

              </div>

            </div>

            {/* SUBTOTAL */}

            <div className="mt-3 flex items-center justify-between px-2">

              <span className="text-[10px] font-medium text-white/65">
                {discountUnlocked
                  ? "After discount"
                  : "Subtotal"}
              </span>

              <div className="text-right">

                {discountUnlocked && (
                  <span className="mr-2 text-[9px] text-white/50 line-through">
                    ৳{totalPrice.toFixed(2)}
                  </span>
                )}

                <span className="text-base font-black">
                  ৳{finalSubtotal.toFixed(2)}
                </span>

              </div>

            </div>

            {/* PROCEED TO CART */}

            <button
              type="button"
              onClick={handleCart}
              className="
                mt-3
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                bg-white
                px-4
                py-3
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
                  View Cart
                </span>

                <ChevronRight size={15} />

              </div>

            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          SMALL DRAGGABLE FLOATING CART
      ========================================== */}

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.08}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          x: position.x,
          y: position.y,
        }}
        className="
          fixed
          bottom-[88px]
          right-3
          z-[9995]
          touch-none
          select-none
        "
      >

        <motion.button
          type="button"
          onClick={() => {
            if (!isDragging) {
              setOpen(true);
            }
          }}
          whileTap={{ scale: 0.94 }}
          className="
            flex
            h-12
            items-center
            gap-2
            rounded-full
            bg-[#e4004f]
            px-3
            text-white
            shadow-[0_8px_28px_rgba(190,0,55,0.32)]
            border
            border-white/15
          "
          aria-label="Open floating cart"
        >

          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15">

            <ShoppingBag size={16} />

            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                h-4
                min-w-4
                items-center
                justify-center
                rounded-full
                bg-white
                px-1
                text-[8px]
                font-black
                text-[#e4004f]
                shadow-sm
              "
            >
              {totalItems}
            </span>

          </div>

          <div className="flex flex-col items-start leading-none">

            <span className="text-[9px] font-semibold text-white/70">
              Cart
            </span>

            <span className="mt-0.5 text-[11px] font-black">
              ৳{totalPrice.toFixed(0)}
            </span>

          </div>

          <ChevronRight size={15} />

        </motion.button>

        {/* DRAG HANDLE */}

        <div
          className="
            pointer-events-none
            absolute
            -top-3
            left-1/2
            -translate-x-1/2
            rounded-full
            bg-white
            px-1.5
            py-0.5
            text-gray-400
            shadow-sm
          "
        >
          <GripVertical size={10} />
        </div>

      </motion.div>
    </>
  );
}
