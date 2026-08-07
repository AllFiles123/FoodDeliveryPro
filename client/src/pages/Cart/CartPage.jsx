import { motion, AnimatePresence } from "framer-motion";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  MoreVertical, 
  Clock, 
  Star,
  Ticket
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
    totalItems
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
          <button
            onClick={() => navigate("/restaurants")}
            className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg"
          >
            Explore Food
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">My Cart List</h1>
        <button className="p-2 bg-white rounded-full shadow-sm">
          <MoreVertical size={20} className="text-gray-800" />
        </button>
      </div>

      <div className="px-6">
        {/* Cart Items List */}
        <div className="space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image || "https://via.placeholder.com/150"} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-sm font-bold text-gray-800">{item.name}</h2>
                    <button onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} className="text-gray-300 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-1 opacity-60">
                    <div className="flex items-center gap-1 text-[9px]">
                      <Clock size={10} /> <span>15-20 min</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px]">
                      <Star size={10} className="text-orange-400 fill-orange-400" />
                      <span>4.9 (236)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="font-black text-gray-800 text-base">
                      <span className="text-orange-500 text-sm mr-0.5">৳</span>{item.price}
                    </p>

                    <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
                      <button onClick={() => decreaseQty(item.id)} className="p-1">
                        <Minus size={14} className="text-gray-500" />
                      </button>
                      <span className="mx-2 text-xs font-bold text-gray-800">
                        {item.qty < 10 ? `0${item.qty}` : item.qty}
                      </span>
                      <button onClick={() => increaseQty(item.id)} className="p-1 bg-black text-white rounded-full">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Promo Code Input Box */}
        <div className="mt-8 flex gap-2">
          <div className="flex-1 relative">
            <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Enter promo code"
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 transition-all active:scale-95">
            Apply
          </button>
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
          
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Order Amount</span>
              <span className="text-gray-800 font-bold">৳{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-gray-800 font-bold">৳60.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="text-gray-800 font-bold">৳2.00</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-5">
            <span className="text-base font-bold text-gray-800">Total Amount</span>
            <p className="text-2xl font-black text-gray-800">
               <span className="text-orange-500 mr-1 italic">৳</span>
               {(totalPrice + 62).toFixed(2)}
            </p>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-8 w-full bg-black hover:bg-gray-900 text-white py-5 rounded-[2rem] font-bold text-base shadow-xl transition-all active:scale-95"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
