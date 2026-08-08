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

      alert(
        response.message || "Order cancelled successfully"
      );

      await loadOrders();
    } catch (error) {
      console.error("Cancel Error:", error);

      alert(
        error?.response?.data?.message ||
          "Order cancel failed"
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const status =
      order.orderStatus ||
      order.trackingStatus ||
      "Order Placed";

    if (activeTab === "All") return true;

    if (activeTab === "Completed") {
      return status === "Delivered";
    }

    if (activeTab === "Cancelled") {
      return status === "Cancelled";
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-slate-500">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] px-5 pt-2 pb-32">

      {/* TITLE */}
      <h1 className="text-xl font-black text-center text-slate-800 mb-5">
        Order List
      </h1>

      {/* FILTER TABS */}
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

      {/* ORDERS */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          let items = [];

          try {
            items =
              typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items || [];
          } catch {
            items = [];
          }

          const currentStatus =
            order.orderStatus ||
            order.trackingStatus ||
            "Order Placed";

          const activeStep =
            currentStatus === "Cancelled"
              ? -1
              : trackingSteps.indexOf(currentStatus);

          let trackingHistory = [];

          try {
            trackingHistory = JSON.parse(
              order.trackingHistory || "[]"
            );
          } catch {
            trackingHistory = [];
          }

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-md shadow-gray-100 border border-gray-50 overflow-hidden"
            >

              {/* CARD MAIN INFO */}
              <div className="p-5">

                <div className="flex items-center gap-4">

                  {/* PRODUCT IMAGE */}
                  <div className="h-16 w-16 bg-[#FFF4EE] rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {items[0]?.image ? (
                      <img
                        src={items[0].image}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <Utensils
                        className="text-orange-300"
                        size={24}
                      />
                    )}
                  </div>

                  {/* ORDER DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Order #
                      {order.orderNumber?.slice(-8) ||
                        "DLSF1234"}
                    </h3>

                    <p className="text-gray-400 text-[10px] mt-0.5">
                      {order.restaurantName ||
                        "Foodzy Restaurant"}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="text-right">
                    <p className="font-black text-slate-800 text-lg">
                      ৳{order.totalAmount}
                    </p>
                  </div>

                </div>

                {/* CARD FOOTER */}
                <div className="flex items-end justify-between mt-5 pt-4 border-t border-gray-50">

                  <div className="flex flex-col gap-1.5">

                    <span className="px-3 py-1 bg-white border border-orange-200 text-orange-500 rounded-full text-[10px] font-bold w-fit">
                      {items.length} items
                    </span>

                    <p className="text-[10px] text-gray-400">
                      {currentStatus === "Delivered"
                        ? `Delivered on ${new Date().toLocaleDateString()}`
                        : `Status: ${currentStatus}`}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setOpen(
                        open === order.id
                          ? null
                          : order.id
                      )
                    }
                    className="bg-[#FFF4EE] text-orange-500 px-6 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                  >
                    {open === order.id
                      ? "Close"
                      : "Details"}
                  </button>

                </div>
              </div>

              {/* EXPANDED DETAILS */}
              <AnimatePresence>
                {open === order.id && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="px-5 pb-8 bg-[#FCFCFC]"
                  >

                    <div className="pt-6 border-t border-dashed border-gray-200">

                      {/* ORDER SUMMARY */}
                      <h3 className="text-lg font-extrabold text-slate-800 mb-5">
                        Order Summary
                      </h3>

                      {/* ITEM DETAILS */}
                      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm mb-5">

                        <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                          <Utensils
                            size={16}
                            className="text-orange-500"
                          />
                          Item Details
                        </h4>

                        {items.map((item) => {
                          const itemQty = Number(
                            item.quantity ||
                              item.qty ||
                              1
                          );

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 mb-3 last:mb-0"
                            >

                              {item.image ? (
                                <img
                                  src={item.image}
                                  className="h-12 w-12 rounded-xl object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                  <Utensils
                                    size={20}
                                    className="text-gray-300"
                                  />
                                </div>
                              )}

                              <div className="flex-1">
                                <p className="font-bold text-xs">
                                  {item.name}
                                </p>

                                <p className="text-[10px] text-gray-500">
                                  Qty: {itemQty}
                                </p>
                              </div>

                              <p className="font-bold text-xs text-slate-800">
                                ৳
                                {Number(
                                  item.price || 0
                                ) * itemQty}
                              </p>

                            </div>
                          );
                        })}

                      </div>

                      {/* CUSTOMER DETAILS */}
                      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm mb-5">

                        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                          <UserRound
                            size={16}
                            className="text-orange-500"
                          />
                          Customer Details
                        </h4>

                        <div className="space-y-1.5 text-xs text-gray-600">

                          <p>
                            <span className="font-medium">
                              Name:
                            </span>{" "}
                            {order.customerName ||
                              "N/A"}
                          </p>

                          <p className="flex items-center gap-1.5">
                            <Phone size={12} />
                            {order.customerPhone ||
                              "No phone"}
                          </p>

                          <p className="flex items-start gap-1.5">
                            <MapPin
                              size={12}
                              className="mt-0.5"
                            />
                            {order.fullAddress ||
                              order.address ||
                              "No address"}
                          </p>

                        </div>
                      </div>

                      {/* PAYMENT DETAILS */}
                      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm mb-5">

                        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                          <CreditCard
                            size={16}
                            className="text-orange-500"
                          />
                          Payment Details
                        </h4>

                        <p className="text-xs text-gray-600">
                          Method:{" "}
                          {order.paymentMethod}
                        </p>

                        <p className="text-xs text-gray-600 mt-1 font-semibold">
                          Status:{" "}
                          {order.paymentStatus ||
                            "Pending"}
                        </p>

                      </div>

                      {/* BILL SUMMARY */}
                      <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm mb-5">

                        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                          <Receipt
                            size={16}
                            className="text-orange-500"
                          />
                          Bill Summary
                        </h4>

                        <div className="space-y-1 text-xs text-gray-600">

                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>
                              ৳{" "}
                              {order.subtotal ||
                                order.totalAmount}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span>
                              Delivery Charge:
                            </span>
                            <span>
                              ৳{" "}
                              {order.deliveryCharge ||
                                0}
                            </span>
                          </div>

                          <div className="flex justify-between border-b pb-1">
                            <span>VAT:</span>
                            <span>
                              ৳ {order.vat || 0}
                            </span>
                          </div>

                          <div className="flex justify-between text-base font-black text-slate-800 pt-1.5">
                            <span>
                              Total Amount:
                            </span>
                            <span>
                              ৳ {order.totalAmount}
                            </span>
                          </div>

                        </div>
                      </div>

                      {/* ESTIMATED DELIVERY */}
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-6 rounded-2xl bg-[#FFFBF8] p-4 border border-orange-100"
                      >

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-[10px] text-gray-500">
                              Estimated Delivery
                            </p>

                            <p className="font-bold text-orange-600 text-sm">
                              {order.estimatedDeliveryTime ||
                                "30-45 minutes"}
                            </p>
                          </div>

                          <motion.div
                            animate={{
                              x: [0, 8, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                            }}
                          >
                            <Bike
                              size={28}
                              className="text-orange-500"
                            />
                          </motion.div>

                        </div>

                        {currentStatus ===
                          "Out for Delivery" && (
                          <p className="mt-3 text-[11px] font-semibold text-orange-500">
                            Your rider is on the way 🚴
                          </p>
                        )}

                      </motion.div>

                      {/* LIVE TRACKING */}
                      <div className="mt-8">

                        <h3 className="font-extrabold text-sm mb-6">
                          Live Tracking
                        </h3>

                        <div className="relative space-y-8 ml-3">

                          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                          {trackingSteps.map(
                            (step, index) => (
                              <div
                                key={step}
                                className="relative flex items-center gap-4"
                              >

                                <div
                                  className={`z-10 h-5 w-5 rounded-full ring-4 ring-[#FCFCFC] flex items-center justify-center ${
                                    index <= activeStep
                                      ? "bg-orange-500"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  {index <
                                    activeStep && (
                                    <CheckCircle
                                      size={14}
                                      className="text-white"
                                    />
                                  )}
                                </div>

                                <div>

                                  <p
                                    className={`text-xs ${
                                      index <=
                                      activeStep
                                        ? "font-bold text-slate-800"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step}
                                  </p>

                                  {trackingHistory.find(
                                    (h) =>
                                      h.status ===
                                      step
                                  ) && (
                                    <p className="text-[9px] text-gray-400 mt-0.5">
                                      {new Date(
                                        trackingHistory.find(
                                          (h) =>
                                            h.status ===
                                            step
                                        ).time
                                      ).toLocaleString()}
                                    </p>
                                  )}

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      </div>

                      {/* CANCEL BUTTON */}
                      {currentStatus !==
                        "Delivered" &&
                        currentStatus !==
                          "Cancelled" && (
                          <button
                            onClick={() =>
                              cancelOrder(order.id)
                            }
                            className="mt-8 w-full flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-red-500 font-bold text-xs transition-colors hover:bg-red-100"
                          >
                            <XCircle size={16} />
                            Cancel Order
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
