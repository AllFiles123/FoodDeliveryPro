import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import {
  Phone,
  MapPin,
  Utensils,
  UserRound,
  CreditCard,
  Receipt,
  Bike,
  XCircle,
  CheckCircle,
  Store,
} from "lucide-react";

import orderService from "../../services/orderService";

const trackingSteps = [
  "Order Placed",
  "Confirmed",
  "Preparing Food",
  "Rider Assigned",
  "Out for Delivery",
  "Delivered",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const loadOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const response = await orderService.cancelOrder(id);
      alert(response.message || "Order cancelled successfully");
      await loadOrders();
    } catch (error) {
      console.error("Cancel Error:", error);
      alert(error?.response?.data?.message || "Order cancel failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-gray-400">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] px-5 pt-4 pb-32">
      
      {/* Page Title */}
      <h1 className="text-xl font-black text-center text-gray-800 mb-6">
        Order History
      </h1>

      {/* Tabs (Image 1 Style) */}
      <div className="flex bg-white shadow-sm border border-gray-100 rounded-full p-1.5 mb-8">
        {["All", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          let items = [];
          try {
            items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
          } catch { items = []; }

          const currentStatus = order.orderStatus || order.trackingStatus || "Order Placed";
          const activeStep = currentStatus === "Cancelled" ? -1 : trackingSteps.indexOf(currentStatus);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden"
            >
              {/* Card Header Section (Styled like Image 1) */}
              <div className="p-5">
                <div className="flex items-center gap-4">
                  {/* Food Image Placeholder */}
                  <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {items[0]?.image ? (
                      <img src={items[0].image} className="w-full h-full object-cover" />
                    ) : (
                      <Utensils className="text-orange-300" size={24} />
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">
                      Order #{order.orderNumber?.slice(-8) || "DLSF1234"}
                    </h3>
                    <p className="text-gray-400 text-[10px]">
                      {order.restaurantName || "Foodzy Restaurant"}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-black text-gray-800 text-lg">৳{order.totalAmount}</p>
                  </div>
                </div>

                {/* Card Bottom Row: Items & Details Button */}
                <div className="flex items-end justify-between mt-5 pt-4 border-t border-gray-50">
                   <div className="flex flex-col gap-1.5">
                      <span className="px-3 py-1 bg-white border border-orange-200 text-orange-500 rounded-full text-[10px] font-bold w-fit">
                        {items.length} items
                      </span>
                      <p className="text-[9px] text-gray-400">
                        Status: {currentStatus}
                      </p>
                   </div>
                   
                   <button
                     onClick={() => setOpen(open === order.id ? null : order.id)}
                     className="bg-orange-50 text-orange-500 px-6 py-2 rounded-full text-xs font-bold transition-active active:scale-95"
                   >
                     {open === order.id ? "Close" : "Details"}
                   </button>
                </div>
              </div>

              {/* Collapsible Content (Logic from your original file) */}
              <AnimatePresence>
                {open === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-6 bg-[#FAFAFA]"
                  >
                    <div className="pt-6 space-y-6">
                      
                      {/* Item Details */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
                           <Utensils size={14} className="text-orange-500" /> Item Details
                        </h4>
                        <div className="space-y-3">
                          {items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                              <p className="text-gray-600 font-medium">{item.name} x {item.quantity || 1}</p>
                              <p className="font-bold">৳{Number(item.price || 0) * (item.quantity || 1)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
                          <UserRound size={14} className="text-orange-500" /> Customer Info
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {order.customerName} <br />
                          {order.customerPhone} <br />
                          {order.fullAddress || order.address}
                        </p>
                      </div>

                      {/* Bill Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
                          <Receipt size={14} className="text-orange-500" /> Bill Summary
                        </h4>
                        <div className="text-[11px] space-y-1.5">
                          <div className="flex justify-between"><span>Subtotal</span> <span>৳{order.subtotal || order.totalAmount}</span></div>
                          <div className="flex justify-between"><span>Delivery</span> <span>৳{order.deliveryCharge || 0}</span></div>
                          <div className="flex justify-between font-bold text-gray-800 border-t pt-1.5"><span>Total</span> <span>৳{order.totalAmount}</span></div>
                        </div>
                      </div>

                      {/* Order Tracking (Original Logic) */}
                      <div className="pt-2">
                        <h4 className="text-xs font-bold mb-5">Order Tracking</h4>
                        <div className="relative space-y-6 ml-2 border-l-2 border-gray-100 pl-6">
                          {trackingSteps.map((step, index) => (
                            <div key={step} className="relative">
                              <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full ring-4 ring-[#FAFAFA] ${index <= activeStep ? "bg-orange-500" : "bg-gray-200"}`}>
                                {index < activeStep && <CheckCircle size={10} className="text-white m-auto mt-0.5" />}
                              </div>
                              <p className={`text-[11px] ${index <= activeStep ? "font-bold text-gray-800" : "text-gray-400"}`}>
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cancel Order Action */}
                      {currentStatus !== "Delivered" && currentStatus !== "Cancelled" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="w-full py-3 bg-red-50 text-red-500 rounded-2xl text-[11px] font-bold flex items-center justify-center gap-2"
                        >
                          <XCircle size={14} /> Cancel this order
                        </button>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
