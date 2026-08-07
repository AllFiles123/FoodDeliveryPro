import { motion, AnimatePresence } from "framer-motion";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  MoreVertical, 
  Clock, 
  Star 
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

  // Empty Cart State
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
          <p className="text-gray-500 mt-2">Add some delicious food to get started!</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="mt-8 rounded-full bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition-transform active:scale-95"
          >
            Explore Food
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-10">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-6 bg-transparent">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">My Cart List</h1>
        <button className="p-2">
          <MoreVertical size={22} className="text-gray-800" />
        </button>
      </div>

      <div className="px-6 space-y-4">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="relative flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100"
            >
              {/* Item Image */}
              <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.image || "https://via.placeholder.com/150"} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-base font-bold text-gray-800 leading-tight">
                    {item.name}
                  </h2>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock size={12} />
                    <span>15-20 min</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Star size={12} className="text-orange-400 fill-orange-400" />
                    <span>4.9 (236)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-black text-gray-800">
                    <span className="text-orange-500 mr-0.5">৳</span>{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="p-1.5 text-gray-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mx-2 text-sm font-bold text-gray-800 min-w-[20px] text-center">
                      {item.qty < 10 ? `0${item.qty}` : item.qty}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="p-1.5 bg-black text-white rounded-full"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Promo Code Section */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <span className="text-sm font-bold text-gray-400 ml-2">3H4-KU70</span>
          <button className="bg-orange-500/10 text-orange-600 px-5 py-2 rounded-full text-xs font-bold border border-orange-500/20">
            Promo-code Confirmed
          </button>
        </div>

        {/* Order Summary Section */}
        <div className="mt-6 pt-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
          
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Order Amount</span>
              <span className="text-gray-800 font-bold">৳{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Promo-code</span>
              <span className="text-gray-800 font-bold">-৳0.00</span>
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

          {/* Action Button */}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-8 w-full bg-black text-white py-5 rounded-[2rem] font-bold text-base shadow-xl shadow-gray-300 transition-transform active:scale-[0.98]"
          >
            Proceed Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
