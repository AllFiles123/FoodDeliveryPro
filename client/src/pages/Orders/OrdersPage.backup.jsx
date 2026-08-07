import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Utensils,
  UserRound,
  CreditCard,
  Receipt,
  Bike,
  XCircle,
  Clock,
  CheckCircle,
  Store,
  ArrowLeft,
  Settings
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
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-orange-500 border-gray-200 animate-spin mb-2"></div>
          <p className="font-bold text-gray-500">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F0] to-[#F4F4F4] px-5 py-6 pb-32 font-sans">
      
      {/* Header section (Image 1 style) */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <button className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-800">Order History</h1>
        <button className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <Settings size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Custom Tabs (Image 1 style) */}
      <div className="flex bg-white p-1 rounded-full shadow-sm mb-8">
        {["All", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-bold rounded-full transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-[#FBA661] to-[#FF7D45] text-white shadow-lg"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          let items = [];
          try {
            items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
          } catch { items = []; }

          const currentStatus = order.orderStatus || order.trackingStatus || "Order Placed";
          const activeStep = currentStatus === "Cancelled" ? -1 : trackingSteps.indexOf(currentStatus);
          
          let trackingHistory = [];
          try { trackingHistory = JSON.parse(order.trackingHistory || "[]"); } catch { trackingHistory = []; }

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-5 shadow-md shadow-gray-200/50 relative overflow-hidden"
            >
              {/* Card Top Section (Logo, Info, Price) */}
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setOpen(open === order.id ? null : order.id)}
              >
                <div className="h-16 w-16 bg-[#FFF1E8] rounded-2xl flex items-center justify-center p-2">
                  {items[0]?.image ? (
                    <img src={items[0].image} className="w-full h-full object-cover rounded-xl" alt="food" />
                  ) : (
                    <Utensils className="text-orange-400" size={24} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-base leading-tight">
                    Order #{order.orderNumber?.slice(-8) || "DLSF1234"}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">{order.restaurantName || "Foodzy Restaurant"}</p>
                </div>

                <div className="text-right">
                  <p className="font-black text-gray-800 text-lg">৳{order.totalAmount}</p>
                </div>
              </div>

              {/* Card Middle Section (Items count and Status) */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                <div className="flex flex-col gap-2">
                  <span className="inline-flex items-center px-3 py-1 bg-white border border-orange-200 text-orange-500 rounded-full text-[10px] font-bold w-fit">
                    {items.length} items
                  </span>
                  <p className="text-[10px] text-gray-400">
                    Delivered on 12 Aug, 10:45 AM
                  </p>
                </div>

                <button 
                  onClick={() => setOpen(open === order.id ? null : order.id)}
                  className="bg-[#FFF1E8] text-[#FF8B52] px-5 py-2 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  {open === order.id ? "Close" : "Details"}
                </button>
              </div>

              {/* Expanded Details Logic stays the same */}
              <AnimatePresence>
                {open === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pt-6 border-t border-dashed border-gray-200"
                  >
                    {/* Item Details Area */}
                    <div className="space-y-4">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                               <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <p className="text-xs font-bold">{item.name}</p>
                               <p className="text-[10px] text-gray-400">Qty: {item.quantity || item.qty}</p>
                            </div>
                          </div>
                          <p className="text-xs font-bold">৳{Number(item.price) * (item.quantity || 1)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Customer & Address Section */}
                    <div className="bg-gray-50 rounded-2xl p-4 mt-6">
                       <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <MapPin size={14} className="text-orange-500" /> Delivery Address
                       </h4>
                       <p className="text-[11px] text-gray-500">{order.fullAddress || order.address}</p>
                    </div>

                    {/* Live Tracking Logic remains intact */}
                    <div className="mt-8">
                       <h4 className="text-sm font-bold mb-5">Order Tracking</h4>
                       <div className="relative space-y-6 ml-2">
                          <div className="absolute left-2.5 top-0 bottom-0 w-[2px] bg-gray-100"></div>
                          {trackingSteps.map((step, index) => (
                            <div key={step} className="relative flex items-start gap-4">
                              <div className={`z-10 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center ${index <= activeStep ? "bg-orange-500" : "bg-gray-200"}`}>
                                {index < activeStep && <CheckCircle size={12} className="text-white" />}
                              </div>
                              <div className="flex-1 -mt-0.5">
                                <p className={`text-xs font-bold ${index <= activeStep ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {currentStatus !== "Delivered" && currentStatus !== "Cancelled" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="w-full mt-8 py-3 bg-red-50 text-red-500 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} /> Cancel Order
                      </button>
                    )}
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
