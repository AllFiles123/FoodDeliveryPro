import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Clock,
  Star,
  Ticket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-orange-50 text-orange-500 shadow-sm">
              <svg
                width="45"
                height="45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <button
            onClick={() => navigate("/restaurants")}
            className="mt-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            Explore Food
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-10">

      {/* HEADER */}
      <div className="flex items-center px-6 py-6">

        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft
            size={20}
            className="text-gray-800"
          />
        </button>

        <h1 className="flex-1 text-center text-lg font-black text-gray-800">
          My Cart List
        </h1>

        {/* Right spacing keeps title perfectly centered */}
        <div className="h-11 w-11" />

      </div>

      <div className="px-6">

        {/* CART ITEMS */}
        <div className="space-y-4">

          <AnimatePresence>

            {cart.map((item) => (

              <motion.div
                key={item.id}
                layout
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -50,
                }}
                className="flex items-center gap-4 rounded-[2rem] bg-white p-4 shadow-sm"
              >

                {/* PRODUCT IMAGE */}

                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-50">

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />

                </div>

                {/* PRODUCT DETAILS */}

                <div className="flex-1">

                  <div className="flex items-start justify-between">

                    <h2 className="text-sm font-bold text-gray-800">
                      {item.name}
                    </h2>

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="rounded-lg p-1 transition-all active:scale-90"
                    >
                      <Trash2
                        size={14}
                        className="text-gray-300 transition-colors hover:text-red-500"
                      />
                    </button>

                  </div>

                  {/* META */}

                  <div className="mt-1 flex items-center gap-3 opacity-60">

                    <div className="flex items-center gap-1 text-[9px]">
                      <Clock size={10} />
                      <span>15-20 min</span>
                    </div>

                    <div className="flex items-center gap-1 text-[9px]">
                      <Star
                        size={10}
                        className="fill-orange-400 text-orange-400"
                      />
                      <span>4.9 (236)</span>
                    </div>

                  </div>

                  {/* PRICE + QUANTITY */}

                  <div className="mt-3 flex items-center justify-between">

                    <p className="text-base font-black text-gray-800">

                      <span className="mr-0.5 text-sm text-orange-500">
                        ৳
                      </span>

                      {item.price}

                    </p>

                    <div className="flex items-center rounded-full bg-orange-50 px-1 py-1">

                      <button
                        onClick={() =>
                          decreaseQty(item.id)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full transition-all active:scale-90"
                      >
                        <Minus
                          size={14}
                          className="text-orange-500"
                        />
                      </button>

                      <span className="mx-2 min-w-[18px] text-center text-xs font-bold text-gray-800">
                        {item.qty < 10
                          ? `0${item.qty}`
                          : item.qty}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(item.id)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm shadow-orange-200 transition-all active:scale-90"
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                  </div>

                </div>

              </motion.div>

            ))}

          </AnimatePresence>

        </div>

        {/* PROMO CODE */}

        <div className="mt-8 flex gap-2">

          <div className="relative flex-1">

            <Ticket
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Enter promo code"
              className="w-full rounded-2xl border border-gray-100 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-orange-300 focus:ring-1 focus:ring-orange-300"
            />

          </div>

          <button
            className="rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            Apply
          </button>

        </div>

        {/* ORDER SUMMARY */}

        <div className="mt-8">

          <h3 className="mb-4 text-lg font-bold text-gray-800">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm text-gray-500">

            <div className="flex justify-between">
              <span>Order Amount</span>

              <span className="font-bold text-gray-800">
                ৳{totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>

              <span className="font-bold text-gray-800">
                ৳60.00
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>

              <span className="font-bold text-gray-800">
                ৳2.00
              </span>
            </div>

          </div>

          {/* TOTAL */}

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">

            <span className="text-base font-bold text-gray-800">
              Total Amount
            </span>

            <p className="text-2xl font-black text-gray-800">

              <span className="mr-1 italic text-orange-500">
                ৳
              </span>

              {(totalPrice + 62).toFixed(2)}

            </p>

          </div>

          {/* CHECKOUT */}

          <button
            onClick={() => navigate("/checkout")}
            className="mt-8 w-full rounded-[2rem] bg-gradient-to-r from-orange-400 to-orange-500 py-5 text-base font-black text-white shadow-xl shadow-orange-200 transition-all active:scale-[0.98]"
          >
            Checkout
          </button>

        </div>

      </div>

    </div>
  );
}
