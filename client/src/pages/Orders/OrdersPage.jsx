import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  Phone,
  MessageCircle,
  Search,
  SlidersHorizontal,
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

const statusTabs = [
  "All",
  "On The Way",
  "Pending",
  "Received",
  "Cancelled",
  "Confirmed",
];

const getOrderStatus = (order) =>
  order.orderStatus ||
  order.trackingStatus ||
  "Order Placed";

const getOrderDate = (order) => {
  const rawDate =
    order.createdAt ||
    order.orderDate ||
    order.created_at ||
    order.date ||
    order.createdOn;

  if (!rawDate) return null;

  try {
    const date =
      typeof rawDate === "object" && rawDate?.seconds
        ? new Date(rawDate.seconds * 1000)
        : new Date(rawDate);

    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

const getDateKey = (date) => {
  if (!date) return "unknown";

  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ].join("-");
};

const getDateLabel = (date) => {
  if (!date) return "Order History";

  const today = new Date();

  const todayKey = getDateKey(today);
  const dateKey = getDateKey(date);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayKey = getDateKey(yesterday);

  if (dateKey === todayKey) {
    return "Today";
  }

  if (dateKey === yesterdayKey) {
    return "Yesterday";
  }

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const day = date.toLocaleDateString("en-US", {
    day: "2-digit",
  });

  const month = date.toLocaleDateString("en-US", {
    month: "short",
  });

  const year = date.getFullYear();

  return `${weekday}, ${day} ${month} ${year}`;
};

const matchesStatus = (order, tab) => {
  const status = getOrderStatus(order);

  if (tab === "All") return true;

  if (tab === "Received") {
    return status === "Delivered";
  }

  if (tab === "Cancelled") {
    return status === "Cancelled";
  }

  if (tab === "Confirmed") {
    return status === "Confirmed";
  }

  if (tab === "On The Way") {
    return (
      status === "Rider Assigned" ||
      status === "Out for Delivery"
    );
  }

  if (tab === "Pending") {
    return (
      status === "Order Placed" ||
      status === "Preparing Food"
    );
  }

  return true;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

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

  const contactStore = (order, type) => {
    const storePhone =
      order.restaurantPhone ||
      order.storePhone ||
      order.restaurant?.phone ||
      order.store?.phone ||
      order.restaurant?.contactNumber ||
      order.store?.contactNumber;

    if (!storePhone) {
      alert("Store contact number is not available.");
      return;
    }

    const phone = String(storePhone).replace(
      /[^0-9+]/g,
      ""
    );

    if (type === "call") {
      window.location.href = `tel:${phone}`;
      return;
    }

    window.location.href = `sms:${phone}`;
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (!matchesStatus(order, activeTab)) {
        return false;
      }

      if (!query) return true;

      const orderNumber =
        order.orderNumber || "";

      const restaurantName =
        order.restaurantName ||
        order.storeName ||
        "";

      const customerName =
        order.customerName || "";

      return (
        String(orderNumber)
          .toLowerCase()
          .includes(query) ||
        String(restaurantName)
          .toLowerCase()
          .includes(query) ||
        String(customerName)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [orders, activeTab, search]);

  const groupedOrders = useMemo(() => {
    const groups = {};

    filteredOrders.forEach((order) => {
      const date = getOrderDate(order);
      const key = getDateKey(date);

      if (!groups[key]) {
        groups[key] = {
          date,
          orders: [],
        };
      }

      groups[key].orders.push(order);
    });

    return Object.values(groups).sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;

      return b.date.getTime() - a.date.getTime();
    });
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <p className="font-bold text-slate-500">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-32">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-orange-400 to-orange-500 px-5 pt-4 pb-7 shadow-lg">

        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -left-12 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        {/* TITLE */}
        <div className="relative mb-5">
          <h1 className="text-xl font-black text-white">
            Order List
          </h1>

          <p className="mt-1 text-xs font-medium text-orange-50">
            Track and manage your orders
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative flex items-center gap-3">

          <div className="flex h-12 flex-1 items-center rounded-2xl bg-white/95 px-4 shadow-sm">

            <Search
              size={19}
              className="mr-3 flex-shrink-0 text-orange-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search orders"
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-gray-400"
            />

          </div>

          <button
            type="button"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm active:scale-95"
          >
            <SlidersHorizontal size={19} />
          </button>

        </div>

        {/* STATUS TABS */}
        <div className="relative mt-4 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max gap-2">

            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#075C4B] text-white shadow-md"
                    : "bg-white/80 text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}

          </div>
        </div>

      </div>

      {/* ================= ORDERS ================= */}
      <div className="px-5 pt-7">

        {groupedOrders.length === 0 ? (
          <div className="rounded-[2rem] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <Utensils
                size={25}
                className="text-orange-400"
              />
            </div>

            <h3 className="font-black text-slate-800">
              No orders found
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Try another search or status.
            </p>
          </div>
        ) : (
          <div className="space-y-8">

            {groupedOrders.map((group) => (
              <section
                key={
                  group.date
                    ? getDateKey(group.date)
                    : "unknown"
                }
              >

                {/* DATE TITLE */}
                <div className="mb-4 flex items-center gap-3">

                  <h2 className="text-sm font-black text-slate-800">
                    {getDateLabel(group.date)}
                  </h2>

                  <div className="h-px flex-1 bg-orange-100" />

                </div>

                {/* GROUP CARDS */}
                <div className="space-y-5">

                  {group.orders.map((order) => {
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
                      getOrderStatus(order);

                    const activeStep =
                      currentStatus === "Cancelled"
                        ? -1
                        : trackingSteps.indexOf(
                            currentStatus
                          );

                    let trackingHistory = [];

                    try {
                      trackingHistory =
                        JSON.parse(
                          order.trackingHistory ||
                            "[]"
                        );
                    } catch {
                      trackingHistory = [];
                    }

                    const orderDate =
                      getOrderDate(order);

                    return (
                      <motion.div
                        key={order.id}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="overflow-hidden rounded-[2rem] border border-orange-50 bg-white shadow-md shadow-orange-100/40"
                      >

                        {/* ================= CARD HEADER ================= */}
                        <div className="p-5 pb-4">

                          <div className="flex items-start gap-3">

                            {/* IMAGE */}
                            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-[#FFF4EE]">

                              {items[0]?.image ? (
                                <img
                                  src={items[0].image}
                                  className="h-full w-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Utensils
                                    size={22}
                                    className="text-orange-300"
                                  />
                                </div>
                              )}

                            </div>

                            {/* RESTAURANT */}
                            <div className="min-w-0 flex-1">

                              <h3 className="truncate text-sm font-black text-slate-800">
                                {order.restaurantName ||
                                  order.storeName ||
                                  "Foodzy Restaurant"}
                              </h3>

                              <p className="mt-1 text-[10px] text-gray-400">
                                Order #
                                {order.orderNumber?.slice(
                                  -8
                                ) || "DLSF1234"}
                              </p>

                              {orderDate && (
                                <p className="mt-1 text-[10px] text-gray-400">
                                  {orderDate.toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              )}

                            </div>

                            {/* PRICE */}
                            <div className="text-right">

                              <p className="text-base font-black text-slate-800">
                                ৳
                                {order.totalAmount}
                              </p>

                              <span
                                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                  currentStatus ===
                                  "Cancelled"
                                    ? "bg-red-50 text-red-500"
                                    : currentStatus ===
                                      "Delivered"
                                    ? "bg-green-50 text-green-600"
                                    : "bg-orange-50 text-orange-500"
                                }`}
                              >
                                {currentStatus}
                              </span>

                            </div>

                          </div>

                          {/* ================= STORE ACTIONS ================= */}
                          <div className="mt-4 flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                contactStore(
                                  order,
                                  "call"
                                )
                              }
                              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 text-orange-500 transition-all active:scale-[0.98]"
                            >
                              <Phone size={15} />
                              <span className="text-[11px] font-bold">
                                Call Store
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                contactStore(
                                  order,
                                  "message"
                                )
                              }
                              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 text-orange-500 transition-all active:scale-[0.98]"
                            >
                              <MessageCircle
                                size={15}
                              />
                              <span className="text-[11px] font-bold">
                                Message Store
                              </span>
                            </button>

                          </div>

                          {/* ================= CARD FOOTER ================= */}
                          <div className="mt-4 flex items-end justify-between border-t border-gray-50 pt-4">

                            <div className="flex flex-col gap-1">

                              <span className="w-fit rounded-full border border-orange-100 bg-white px-3 py-1 text-[10px] font-bold text-orange-500">
                                {items.length} items
                              </span>

                              <p className="text-[10px] text-gray-400">
                                {currentStatus ===
                                "Delivered"
                                  ? "Order received successfully"
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
                              className="rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                            >
                              {open === order.id
                                ? "Close"
                                : "Details"}
                            </button>

                          </div>

                        </div>

                        {/* ================= EXPANDED DETAILS ================= */}
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
                              className="bg-[#FCFCFC] px-5 pb-8"
                            >

                              <div className="border-t border-dashed border-gray-200 pt-6">

                                {/* ORDER SUMMARY */}
                                <h3 className="mb-5 text-lg font-extrabold text-slate-800">
                                  Order Summary
                                </h3>

                                {/* ITEM DETAILS */}
                                <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <Utensils
                                      size={16}
                                      className="text-orange-500"
                                    />
                                    Item Details
                                  </h4>

                                  {items.map((item) => {
                                    const itemQty =
                                      Number(
                                        item.quantity ||
                                          item.qty ||
                                          1
                                      );

                                    return (
                                      <div
                                        key={item.id}
                                        className="mb-3 flex items-center gap-3 last:mb-0"
                                      >

                                        {item.image ? (
                                          <img
                                            src={
                                              item.image
                                            }
                                            className="h-12 w-12 rounded-xl object-cover"
                                            alt=""
                                          />
                                        ) : (
                                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                                            <Utensils
                                              size={20}
                                              className="text-gray-300"
                                            />
                                          </div>
                                        )}

                                        <div className="flex-1">
                                          <p className="text-xs font-bold">
                                            {item.name}
                                          </p>

                                          <p className="text-[10px] text-gray-500">
                                            Qty:{" "}
                                            {itemQty}
                                          </p>
                                        </div>

                                        <p className="text-xs font-bold text-slate-800">
                                          ৳
                                          {Number(
                                            item.price ||
                                              0
                                          ) *
                                            itemQty}
                                        </p>

                                      </div>
                                    );
                                  })}

                                </div>

                                {/* CUSTOMER DETAILS */}
                                <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
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
                                <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
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

                                  <p className="mt-1 text-xs font-semibold text-gray-600">
                                    Status:{" "}
                                    {order.paymentStatus ||
                                      "Pending"}
                                  </p>

                                </div>

                                {/* BILL SUMMARY */}
                                <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <Receipt
                                      size={16}
                                      className="text-orange-500"
                                    />
                                    Bill Summary
                                  </h4>

                                  <div className="space-y-1 text-xs text-gray-600">

                                    <div className="flex justify-between">
                                      <span>
                                        Subtotal:
                                      </span>

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
                                      <span>
                                        VAT:
                                      </span>

                                      <span>
                                        ৳{" "}
                                        {order.vat || 0}
                                      </span>
                                    </div>

                                    <div className="flex justify-between pt-1.5 text-base font-black text-slate-800">
                                      <span>
                                        Total Amount:
                                      </span>

                                      <span>
                                        ৳{" "}
                                        {
                                          order.totalAmount
                                        }
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
                                  className="mt-6 rounded-2xl border border-orange-100 bg-[#FFFBF8] p-4"
                                >

                                  <div className="flex items-center justify-between">

                                    <div>
                                      <p className="text-[10px] text-gray-500">
                                        Estimated Delivery
                                      </p>

                                      <p className="text-sm font-bold text-orange-600">
                                        {order.estimatedDeliveryTime ||
                                          "30-45 minutes"}
                                      </p>
                                    </div>

                                    <motion.div
                                      animate={{
                                        x: [0, 8, 0],
                                      }}
                                      transition={{
                                        repeat:
                                          Infinity,
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
                                      Your rider is on the way
                                    </p>
                                  )}

                                </motion.div>

                                {/* LIVE TRACKING */}
                                <div className="mt-8">

                                  <h3 className="mb-6 text-sm font-extrabold">
                                    Live Tracking
                                  </h3>

                                  <div className="relative ml-3 space-y-8">

                                    <div className="absolute bottom-2 left-2.5 top-2 w-0.5 bg-gray-100" />

                                    {trackingSteps.map(
                                      (
                                        step,
                                        index
                                      ) => (
                                        <div
                                          key={step}
                                          className="relative flex items-center gap-4"
                                        >

                                          <div
                                            className={`z-10 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-[#FCFCFC] ${
                                              index <=
                                              activeStep
                                                ? "bg-orange-500"
                                                : "bg-gray-200"
                                            }`}
                                          >
                                            {index <
                                              activeStep && (
                                              <CheckCircle
                                                size={
                                                  14
                                                }
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
                                              <p className="mt-0.5 text-[9px] text-gray-400">
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

                                {/* CANCEL */}
                                {currentStatus !==
                                  "Delivered" &&
                                  currentStatus !==
                                    "Cancelled" && (
                                    <button
                                      onClick={() =>
                                        cancelOrder(
                                          order.id
                                        )
                                      }
                                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-100"
                                    >
                                      <XCircle
                                        size={16}
                                      />
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
              </section>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
