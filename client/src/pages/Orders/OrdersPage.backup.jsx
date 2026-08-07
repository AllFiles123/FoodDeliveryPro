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
  const [activeTab, setActiveTab] = useState("All"); // Tab logic added for design

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
      console.log("Cancel Response:", response);
      alert(response.message || "Order cancelled successfully");
      await loadOrders();
    } catch (error) {
      console.error("Cancel Error:", error);
      alert(error?.response?.data?.message || "Order cancel failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-text">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] px-5 py-4 pb-32">
      
      {/* Title - Pushed to top */}
      <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
        Order History
      </h1>

      {/* Tabs - Pushed higher and styled like Image 1 */}
      <div className="flex bg-white shadow-sm border border-gray-100 rounded-full p-1 mb-8">
        {["All", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {orders.map((order) => {
          let items = [];
          try {
            items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
          } catch {
            items = [];
          }

          const currentStatus = order.orderStatus || order.trackingStatus || "Order Placed";
          const activeStep = currentStatus === "Cancelled" ? -1 : trackingSteps.indexOf(currentStatus);

          let trackingHistory = [];
          try {
            trackingHistory = JSON.parse(order.trackingHistory || "[]");
          } catch {
            trackingHistory = [];
          }

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] bg-white shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-5 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Store size={20} className="text-orange-500" />
                    <h2 className="font-bold text-lg">
                      {order.restaurantName || "Foodzy Restaurant"}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Order #{order.orderNumber?.slice(-8) || "DLSF1234"}
                  </p>
                  <p className="font-extrabold text-xl text-slate-800 mt-2">
                    ৳ {order.totalAmount}
                  </p>
                  <span className="inline-block mt-2 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold text-orange-600 border border-orange-100">
                    {currentStatus}
                  </span>
                </div>

                <button
                  onClick={() => setOpen(open === order.id ? null : order.id)}
                  className="text-gray-400 p-2 bg-gray-50 rounded-full"
                >
                  {open === order.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
              </div>

              <AnimatePresence>
                {open === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5"
                  >
                    <div className="border-t border-dashed border-gray-200 pt-5">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>

                      {/* ITEM DETAILS (From your original file) */}
                      <div className="space-y-4 mb-6">
                        {items.map((item) => {
                          const itemQty = Number(item.quantity || item.qty || 1);
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              {item.image ? (
                                <img src={item.image} className="h-14 w-14 rounded-2xl object-cover shadow-sm" />
                              ) : (
                                <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                                  <Utensils size={24} className="text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-bold text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">Quantity: {itemQty}</p>
                              </div>
                              <p className="font-bold text-sm">৳ {Number(item.price || 0) * itemQty}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* CUSTOMER DETAILS (Restored) */}
                      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 mb-4">
                        <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                          <UserRound size={16} className="text-orange-500" /> Customer Details
                        </h4>
                        <p className="text-xs text-gray-600">Name: {order.customerName || "N/A"}</p>
                        <p className="text-xs text-gray-600 flex gap-2 mt-2 font-medium">
                          <Phone size={14} /> {order.customerPhone || "No phone"}
                        </p>
                        <p className="text-xs text-gray-600 flex gap-2 mt-2">
                          <MapPin size={14} /> {order.fullAddress || order.address || "No address"}
                        </p>
                      </div>

                      {/* PAYMENT DETAILS (Restored) */}
                      <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 mb-4">
                        <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                          <CreditCard size={16} className="text-orange-500" /> Payment Details
                        </h4>
                        <p className="text-xs text-gray-600">Method: {order.paymentMethod}</p>
                        <p className="text-xs text-gray-600 mt-2 font-semibold">Status: {order.paymentStatus || "Pending"}</p>
                      </div>

                      {/* BILL SUMMARY (Restored) */}
                      <div className="rounded-2xl bg-[#FFFBF9] p-4 border border-orange-50 mb-4">
                        <h4 className="font-bold text-sm text-orange-600 mb-3 flex items-center gap-2">
                          <Receipt size={16} /> Bill Summary
                        </h4>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Subtotal:</span> <span>৳ {order.subtotal || order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Delivery:</span> <span>৳ {order.deliveryCharge || 0}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 border-b border-gray-100 pb-1.5">
                                <span>VAT:</span> <span>৳ {order.vat || 0}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-slate-800 pt-1">
                                <span>Total:</span> <span>৳ {order.totalAmount}</span>
                            </div>
                        </div>
                      </div>

                      {/* LIVE TRACKING (Restored Logic) */}
                      <div className="mt-8">
                        <h3 className="font-bold text-base mb-6">Live Tracking</h3>
                        <div className="relative space-y-8 ml-3">
                          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                          {trackingSteps.map((step, index) => (
                            <div key={step} className="relative flex items-center gap-4">
                              <div className={`z-10 h-5 w-5 rounded-full flex items-center justify-center ring-4 ring-white ${index <= activeStep ? "bg-orange-500 shadow-lg shadow-orange-200" : "bg-gray-200"}`}>
                                {index < activeStep && <CheckCircle size={14} className="text-white" />}
                              </div>
                              <div>
                                <p className={`text-xs ${index <= activeStep ? "font-bold text-slate-800" : "text-gray-400"}`}>{step}</p>
                                {index === activeStep && (
                                  <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[10px] text-orange-500 font-medium">
                                    Current Status
                                  </motion.p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CANCEL BUTTON (Restored) */}
                      {currentStatus !== "Delivered" && currentStatus !== "Cancelled" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-red-500 font-bold text-sm transition-colors hover:bg-red-100"
                        >
                          <XCircle size={18} /> Cancel Order
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

