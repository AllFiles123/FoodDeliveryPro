import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Truck,
  User,
  Phone,
  ChevronDown,
  Plus,
  Banknote,
  Check,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Navigation,
  Bike,
  Clock3,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";

const dhakaZones = [
  "Uttara",
  "Mohammadpur",
  "Dhanmondi",
  "Mirpur",
  "Gulshan",
  "Banani",
  "Bashundhara",
  "Motijheel",
  "Farmgate",
  "Other Dhaka Areas",
];

const divisions = {
  Dhaka: {
    Gazipur: ["Tongi", "Gazipur Sadar", "Kaliakair"],
    Dhaka: ["Savar", "Keraniganj", "Dohar"],
    Narayanganj: ["Narayanganj Sadar", "Rupganj"],
  },
  Chattogram: {
    Chattogram: ["Pahartali", "Panchlaish", "Kotwali"],
    CoxsBazar: ["Coxs Bazar Sadar", "Teknaf"],
  },
  Rajshahi: {
    Rajshahi: ["Rajshahi Sadar", "Paba"],
  },
};

const SOFT_ORANGE = "#FFF1E7";
const LIGHT_ORANGE = "#FFF7F1";
const ORANGE = "#FF8A4C";
const DARK_ORANGE = "#F26F32";

const PAYMENT_KEYS = [
  "paymentMethods",
  "savedPaymentMethods",
  "userPaymentMethods",
  "profilePaymentMethods",
];

const DISCOUNT_KEYS = [
  "promoDiscount",
  "cartDiscount",
  "discount",
  "promo_discount",
];

/* =========================================================
   ORDER CONFIRMATION POPUP
========================================================= */

function OrderConfirmationPopup({
  orderDate,
  total,
  onBack,
  onTrack,
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 px-4 py-6 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.92,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.94,
          y: 15,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="relative w-full max-w-[390px] overflow-hidden rounded-[34px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)]"
      >
        {/* TOP */}
        <div
          className="relative px-6 pb-5 pt-6"
          style={{
            background:
              "linear-gradient(180deg,#FFF1E7 0%,#FFF8F4 100%)",
          }}
        >
          {/* BACK */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition active:scale-90"
          >
            <ArrowLeft size={19} />
          </button>

          {/* SUCCESS ICON */}
          <div className="flex justify-center pt-2">
            <motion.div
              initial={{ scale: 0.5, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 16,
              }}
              className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full"
              style={{
                backgroundColor: ORANGE,
                boxShadow:
                  "0 12px 30px rgba(255,138,76,0.30)",
              }}
            >
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-white/80">
                <Check
                  size={32}
                  strokeWidth={3}
                  className="text-white"
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-[25px] font-black tracking-tight text-gray-900">
              Order Confirmed
            </h2>

            <p className="mt-1 text-[13px] font-medium text-gray-500">
              Your order has been placed successfully
            </p>
          </div>
        </div>

        {/* ORDER INFO */}
        <div className="px-6 pt-5">
          <div className="rounded-[24px] border border-orange-100 bg-[#FFF9F5] p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: SOFT_ORANGE,
                }}
              >
                <Clock3
                  size={20}
                  style={{
                    color: ORANGE,
                  }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Order Confirmed
                </p>

                <p className="mt-0.5 text-sm font-black text-gray-900">
                  {orderDate}
                </p>
              </div>
            </div>

            <div className="my-4 h-px bg-orange-100" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Order Status
              </span>

              <span
                className="rounded-full px-3 py-1.5 text-[10px] font-black"
                style={{
                  backgroundColor: SOFT_ORANGE,
                  color: DARK_ORANGE,
                }}
              >
                ORDER RECEIVED
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Total Amount
              </span>

              <span className="text-base font-black text-gray-900">
                ৳ {Number(total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* DELIVERY STATUS */}
        <div className="px-6 pt-5">
          <div className="rounded-[25px] border border-gray-100 bg-white">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: SOFT_ORANGE,
                  }}
                >
                  <Truck
                    size={20}
                    style={{
                      color: ORANGE,
                    }}
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Delivery Status
                  </p>

                  <p className="mt-0.5 text-sm font-black text-gray-900">
                    Restaurant is preparing your food
                  </p>
                </div>
              </div>

              {/* TRACKING LINE */}
              <div className="relative mt-6 px-2 pb-1">
                <div className="absolute left-[13px] right-[13px] top-[7px] h-[3px] rounded-full bg-orange-100" />

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "28%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                  }}
                  className="absolute left-[13px] top-[7px] h-[3px] rounded-full"
                  style={{
                    backgroundColor: ORANGE,
                  }}
                />

                <div className="relative flex items-start justify-between">
                  <div className="flex flex-col items-start">
                    <div
                      className="flex h-4 w-4 items-center justify-center rounded-full border-[3px] border-white shadow-sm"
                      style={{
                        backgroundColor: ORANGE,
                      }}
                    />

                    <span
                      className="mt-2 text-[9px] font-black"
                      style={{
                        color: DARK_ORANGE,
                      }}
                    >
                      Order Received
                    </span>
                  </div>

                  <div className="flex flex-col items-center opacity-35">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />

                    <span className="mt-2 text-[9px] font-bold text-gray-400">
                      Preparing
                    </span>
                  </div>

                  <div className="flex flex-col items-end opacity-35">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />

                    <span className="mt-2 text-[9px] font-bold text-gray-400">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAP AREA */}
            <div className="relative h-[105px] overflow-hidden rounded-b-[25px] bg-[#FFF5ED]">
              {/* ROAD 1 */}
              <div className="absolute left-[-20px] top-[42px] h-[22px] w-[120%] rotate-[-8deg] bg-white shadow-sm" />

              {/* ROAD 2 */}
              <div className="absolute left-[20%] top-[-30px] h-[180px] w-[20px] rotate-[24deg] bg-white shadow-sm" />

              {/* ROAD 3 */}
              <div className="absolute right-[-20px] top-[55px] h-[16px] w-[80%] rotate-[14deg] bg-white shadow-sm" />

              {/* MAP DOTS */}
              <div className="absolute left-[18%] top-[20px] h-2 w-2 rounded-full bg-orange-200" />
              <div className="absolute left-[63%] top-[24px] h-2 w-2 rounded-full bg-orange-200" />
              <div className="absolute right-[18%] bottom-[20px] h-2 w-2 rounded-full bg-orange-200" />

              {/* RESTAURANT */}
              <div
                className="absolute left-[18%] top-[31px] flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white shadow-md"
                style={{
                  backgroundColor: ORANGE,
                }}
              >
                <MapPin
                  size={14}
                  className="text-white"
                  fill="currentColor"
                />
              </div>

              {/* BIKE */}
              <motion.div
                animate={{
                  x: [0, 4, 0],
                  y: [0, -2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="absolute right-[19%] top-[43px] flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-white shadow-lg"
                style={{
                  backgroundColor: ORANGE,
                }}
              >
                <Bike
                  size={23}
                  strokeWidth={2.5}
                  className="text-white"
                />
              </motion.div>

              {/* SMALL ROUTE DOTS */}
              <div
                className="absolute left-[34%] top-[52px] h-2 w-2 rounded-full"
                style={{
                  backgroundColor: ORANGE,
                }}
              />

              <div
                className="absolute left-[43%] top-[52px] h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "#FFD4BB",
                }}
              />

              <div
                className="absolute left-[52%] top-[52px] h-2 w-2 rounded-full"
                style={{
                  backgroundColor: "#FFD4BB",
                }}
              />
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="p-6 pt-5">
          <button
            type="button"
            onClick={onTrack}
            className="flex w-full items-center justify-center gap-2 rounded-[20px] py-4 text-sm font-black text-white shadow-lg transition active:scale-[0.98]"
            style={{
              backgroundColor: ORANGE,
              boxShadow:
                "0 12px 25px rgba(255,138,76,0.24)",
            }}
          >
            <Navigation size={18} />
            Track Your Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   CHECKOUT PAGE
========================================================= */

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, totalPrice, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [insideDhaka, setInsideDhaka] = useState(true);
  const [zone, setZone] = useState("");

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [savedPaymentMethods, setSavedPaymentMethods] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [showPaymentHint, setShowPaymentHint] =
    useState(false);

  const [confirmedDate, setConfirmedDate] =
    useState("");

  const [confirmedTotal, setConfirmedTotal] =
    useState(0);

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    try {
      const savedProfile = JSON.parse(
        localStorage.getItem("profileData") || "null"
      );

      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const source = savedProfile || savedUser;

      if (source) {
        setCustomerName(
          source.fullName ||
            source.name ||
            source.customerName ||
            ""
        );

        setCustomerPhone(
          source.phone ||
            source.mobile ||
            source.phoneNumber ||
            ""
        );
      }
    } catch (error) {
      console.error(
        "Unable to load profile",
        error
      );
    }
  }, []);

  /* =====================================================
     HIDE BOTTOM NAV
  ===================================================== */

  useEffect(() => {
    document.body.classList.add("checkout-page");
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.classList.remove(
        "checkout-page"
      );

      document.body.style.overflowX = "";
    };
  }, []);

  /* =====================================================
     PAYMENT METHODS
  ===================================================== */

  useEffect(() => {
    const loadPaymentMethods = () => {
      let found = [];

      for (const key of PAYMENT_KEYS) {
        try {
          const raw =
            localStorage.getItem(key);

          if (!raw) continue;

          const parsed = JSON.parse(raw);

          if (Array.isArray(parsed)) {
            found = parsed;
            break;
          }
        } catch (error) {
          console.error(
            `Unable to read ${key}`,
            error
          );
        }
      }

      setSavedPaymentMethods(found);
    };

    loadPaymentMethods();

    window.addEventListener(
      "paymentMethodsChanged",
      loadPaymentMethods
    );

    window.addEventListener(
      "storage",
      loadPaymentMethods
    );

    return () => {
      window.removeEventListener(
        "paymentMethodsChanged",
        loadPaymentMethods
      );

      window.removeEventListener(
        "storage",
        loadPaymentMethods
      );
    };
  }, []);

  /* =====================================================
     PAYMENT METHOD FROM PROFILE
  ===================================================== */

  useEffect(() => {
    if (location.state?.paymentMethod) {
      setPaymentMethod(
        location.state.paymentMethod
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [location.state]);

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const deliveryType = insideDhaka
    ? "Dhaka Inside"
    : "Outside Dhaka";

  const deliveryCharge = insideDhaka
    ? 60
    : 120;

  const vat = 0;

  const discount = useMemo(() => {
    for (const key of DISCOUNT_KEYS) {
      try {
        const raw =
          localStorage.getItem(key);

        if (
          raw === null ||
          raw === ""
        ) {
          continue;
        }

        const value = Number(raw);

        if (
          Number.isFinite(value) &&
          value > 0
        ) {
          return Math.min(
            value,
            totalPrice
          );
        }
      } catch {
        // Ignore invalid values.
      }
    }

    return 0;
  }, [totalPrice]);

  const grandTotal = Math.max(
    0,
    totalPrice +
      deliveryCharge +
      vat -
      discount
  );

  const districts = division
    ? Object.keys(
        divisions[division] || {}
      )
    : [];

  const upazilas =
    division && district
      ? divisions[division]?.[district] ||
        []
      : [];

  /* =====================================================
     ADDRESS
  ===================================================== */

  const handleInsideToggle = () => {
    const next = !insideDhaka;

    setInsideDhaka(next);

    setZone("");
    setDivision("");
    setDistrict("");
    setUpazila("");
    setFullAddress("");
  };

  /* =====================================================
     PAYMENT SETTINGS
  ===================================================== */

  const goToPaymentSettings = () => {
    navigate("/profile", {
      state: {
        openPaymentMethods: true,
        fromCheckout: true,
      },
    });
  };

  const formatPaymentMethod = (
    method
  ) => {
    if (!method) {
      return "Payment Method";
    }

    if (typeof method === "string") {
      return method;
    }

    return (
      method.name ||
      method.type ||
      method.provider ||
      method.method ||
      method.label ||
      "Payment Method"
    );
  };

  const getPaymentNumber = (
    method
  ) => {
    if (
      !method ||
      typeof method === "string"
    ) {
      return "";
    }

    const value =
      method.number ||
      method.phone ||
      method.accountNumber ||
      method.mobileNumber ||
      method.account ||
      method.last4 ||
      "";

    if (!value) return "";

    const stringValue =
      String(value);

    if (
      method.last4 &&
      stringValue.length === 4
    ) {
      return `•••• ${stringValue}`;
    }

    return stringValue;
  };

  const getPaymentIcon = (
    method
  ) => {
    const name =
      formatPaymentMethod(
        method
      ).toLowerCase();

    if (
      name.includes("cash") ||
      name.includes("cod")
    ) {
      return Banknote;
    }

    if (
      name.includes("bkash") ||
      name.includes("nagad") ||
      name.includes("rocket") ||
      name.includes("upay")
    ) {
      return Navigation;
    }

    return CreditCard;
  };

  const isSamePaymentMethod = (
    current,
    method
  ) => {
    if (current === method) {
      return true;
    }

    if (
      typeof current === "object" &&
      typeof method === "object" &&
      current &&
      method
    ) {
      if (
        current.id &&
        method.id &&
        String(current.id) ===
          String(method.id)
      ) {
        return true;
      }

      const currentLabel =
        formatPaymentMethod(
          current
        );

      const methodLabel =
        formatPaymentMethod(
          method
        );

      const currentNumber =
        getPaymentNumber(
          current
        );

      const methodNumber =
        getPaymentNumber(
          method
        );

      return (
        currentLabel ===
          methodLabel &&
        currentNumber ===
          methodNumber
      );
    }

    return false;
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateCheckout = () => {
    if (cart.length === 0) {
      return "Your cart is empty.";
    }

    if (!customerName.trim()) {
      return "Please enter your full name.";
    }

    if (!customerPhone.trim()) {
      return "Please enter your phone number.";
    }

    if (
      customerPhone.replace(
        /\D/g,
        ""
      ).length < 10
    ) {
      return "Please enter a valid phone number.";
    }

    if (insideDhaka) {
      if (!zone) {
        return "Please select your Dhaka area.";
      }

      if (!fullAddress.trim()) {
        return "Please enter your complete delivery address.";
      }
    } else {
      if (!division) {
        return "Please select your division.";
      }

      if (!district) {
        return "Please select your district.";
      }

      if (!upazila) {
        return "Please select your upazila.";
      }

      if (!fullAddress.trim()) {
        return "Please enter your complete delivery address.";
      }
    }

    return "";
  };

  /* =====================================================
     RETURN DESTINATION
  ===================================================== */

  const getReturnDestination = () => {
    const stateReturn =
      location.state?.returnTo;

    if (
      stateReturn &&
      stateReturn !== "/cart" &&
      stateReturn !== "/checkout"
    ) {
      return stateReturn;
    }

    const storedReturn =
      sessionStorage.getItem(
        "checkoutReturnPath"
      );

    if (
      storedReturn &&
      storedReturn !== "/cart" &&
      storedReturn !== "/checkout"
    ) {
      return storedReturn;
    }

    const restaurantId =
      cart?.[0]?.restaurantId ||
      cart?.[0]?.restaurant_id;

    if (restaurantId) {
      return `/restaurant/${restaurantId}`;
    }

    return "/home";
  };

  const handleSuccessBack = () => {
    setShowSuccess(false);

    const destination =
      getReturnDestination();

    navigate(destination, {
      replace: true,
    });
  };

  const handleTrackOrder = () => {
    setShowSuccess(false);

    navigate("/map", {
      state: {
        fromOrderConfirmation: true,
      },
    });
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const handleOrder = async () => {
    if (loading) return;

    const validationError =
      validateCheckout();

    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setLoading(true);

      const selectedPayment =
        typeof paymentMethod === "string"
          ? paymentMethod
          : formatPaymentMethod(
              paymentMethod
            );

      const paymentStatus =
        selectedPayment ===
        "Cash on Delivery"
          ? "Pending"
          : "Paid";

      const orderPayload = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image || "",
          price:
            Number(item.price) || 0,
          quantity:
            Number(item.qty) || 1,
        })),

        restaurantName:
          cart[0]?.restaurantName ||
          "",

        customerName:
          customerName.trim(),

        customerPhone:
          customerPhone.trim(),

        deliveryType,

        zone: insideDhaka
          ? zone
          : "",

        division: insideDhaka
          ? ""
          : division,

        district: insideDhaka
          ? ""
          : district,

        upazila: insideDhaka
          ? ""
          : upazila,

        fullAddress:
          fullAddress.trim(),

        address:
          fullAddress.trim(),

        subtotal:
          Number(totalPrice) || 0,

        vat: 0,

        discount:
          Number(discount) || 0,

        deliveryCharge,

        totalAmount:
          Number(grandTotal) || 0,

        paymentMethod:
          selectedPayment,

        paymentStatus,

        orderStatus: "Pending",
      };

      await orderService.createOrder(
        orderPayload
      );

      /*
       * SAVE CONFIRMATION DATA BEFORE
       * CLEARING THE CART
       */

      const now = new Date();

      const formattedDate =
        now.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ) +
        " • " +
        now.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      setConfirmedDate(
        formattedDate
      );

      setConfirmedTotal(
        Number(grandTotal) || 0
      );

      clearCart();

      DISCOUNT_KEYS.forEach(
        (key) => {
          localStorage.removeItem(key);
        }
      );

      /*
       * SHOW NEW LIGHT ORANGE POPUP
       */

      setShowSuccess(true);
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CHECKOUT BACK
  ===================================================== */

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>
        {`
          body.checkout-page {
            overflow-x: hidden !important;
          }

          body.checkout-page nav.fixed,
          body.checkout-page [data-bottom-nav],
          body.checkout-page .bottom-nav,
          body.checkout-page .bottom-navigation {
            display: none !important;
          }

          .checkout-scroll::-webkit-scrollbar {
            width: 0;
          }

          .checkout-scroll {
            scrollbar-width: none;
          }
        `}
      </style>

      {/* =================================================
          NEW ORDER CONFIRMATION POPUP
      ================================================= */}

      <AnimatePresence>
        {showSuccess && (
          <OrderConfirmationPopup
            orderDate={confirmedDate}
            total={confirmedTotal}
            onBack={handleSuccessBack}
            onTrack={handleTrackOrder}
          />
        )}
      </AnimatePresence>

      {/* =================================================
          CHECKOUT
      ================================================= */}

      <div className="checkout-scroll min-h-screen overflow-y-auto bg-[#F8F8F8] px-4 pb-8 pt-5">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="mx-auto max-w-3xl"
        >
          {/* HEADER */}

          <div className="mb-6 flex items-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
            >
              <ArrowLeft
                size={20}
                className="text-gray-800"
              />
            </button>

            <div className="flex-1 pr-11 text-center">
              <h1 className="text-2xl font-black text-gray-900">
                Checkout
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Complete your order
              </p>
            </div>
          </div>

          {/* EMPTY CART */}

          {cart.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl"
                style={{
                  backgroundColor:
                    SOFT_ORANGE,
                }}
              >
                <ShoppingBag
                  size={36}
                  style={{
                    color: ORANGE,
                  }}
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-gray-900">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add some delicious items before
                proceeding to checkout.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/home")
                }
                className="mt-6 rounded-2xl px-7 py-4 text-sm font-black"
                style={{
                  backgroundColor:
                    SOFT_ORANGE,
                  color: ORANGE,
                }}
              >
                Browse Food
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
              <div className="p-5 sm:p-7">
                {/* CUSTOMER DETAILS */}

                <section>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor:
                          SOFT_ORANGE,
                      }}
                    >
                      <User
                        size={20}
                        style={{
                          color: ORANGE,
                        }}
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-gray-900">
                        Customer Details
                      </h2>

                      <p className="text-xs text-gray-400">
                        Enter your contact information
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <input
                      value={customerName}
                      onChange={(e) =>
                        setCustomerName(
                          e.target.value
                        )
                      }
                      placeholder="Full Name"
                      autoComplete="name"
                      className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none transition focus:border-[#FFD1B5] focus:bg-white"
                    />

                    <div className="flex items-center rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 transition focus-within:border-[#FFD1B5] focus-within:bg-white">
                      <Phone
                        size={18}
                        style={{
                          color: ORANGE,
                        }}
                      />

                      <input
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(
                            e.target.value
                          )
                        }
                        placeholder="Phone Number"
                        inputMode="tel"
                        autoComplete="tel"
                        className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                      />
                    </div>
                  </div>
                </section>

                <div className="my-7 h-px bg-gray-100" />

                {/* DELIVERY ADDRESS */}

                <section>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor:
                          SOFT_ORANGE,
                      }}
                    >
                      <MapPin
                        size={20}
                        style={{
                          color: ORANGE,
                        }}
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-gray-900">
                        Delivery Address
                      </h2>

                      <p className="text-xs text-gray-400">
                        Choose your delivery area
                      </p>
                    </div>
                  </div>

                  {/* INSIDE / OUTSIDE */}

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#FAFAFA] px-4 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Inside Dhaka
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        ON = Inside • OFF = Outside
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Toggle Dhaka delivery area"
                      onClick={
                        handleInsideToggle
                      }
                      className="relative h-8 w-14 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          insideDhaka
                            ? ORANGE
                            : "#D9D9D9",
                      }}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                          insideDhaka
                            ? "left-7"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* INSIDE DHAKA */}

                  <AnimatePresence mode="wait">
                    {insideDhaka && (
                      <motion.div
                        key="inside"
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mt-5 overflow-hidden"
                      >
                        <label className="text-sm font-bold text-gray-800">
                          Dhaka Area
                        </label>

                        <div className="relative mt-2">
                          <select
                            value={zone}
                            onChange={(e) =>
                              setZone(
                                e.target.value
                              )
                            }
                            className="w-full appearance-none rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 pr-11 text-sm outline-none transition focus:border-[#FFD1B5]"
                          >
                            <option value="">
                              Select Dhaka Area
                            </option>

                            {dhakaZones.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              )
                            )}
                          </select>

                          <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* OUTSIDE DHAKA */}

                    {!insideDhaka && (
                      <motion.div
                        key="outside"
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mt-5 space-y-3 overflow-hidden"
                      >
                        <select
                          value={division}
                          onChange={(e) => {
                            setDivision(
                              e.target.value
                            );
                            setDistrict("");
                            setUpazila("");
                          }}
                          className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none transition focus:border-[#FFD1B5]"
                        >
                          <option value="">
                            Select Division
                          </option>

                          {Object.keys(
                            divisions
                          ).map((item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ))}
                        </select>

                        <select
                          value={district}
                          disabled={!division}
                          onChange={(e) => {
                            setDistrict(
                              e.target.value
                            );
                            setUpazila("");
                          }}
                          className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none transition disabled:opacity-50 focus:border-[#FFD1B5]"
                        >
                          <option value="">
                            Select District
                          </option>

                          {districts.map(
                            (item) => (
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
                            )
                          )}
                        </select>

                        <select
                          value={upazila}
                          disabled={!district}
                          onChange={(e) =>
                            setUpazila(
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none transition disabled:opacity-50 focus:border-[#FFD1B5]"
                        >
                          <option value="">
                            Select Upazila
                          </option>

                          {upazilas.map(
                            (item) => (
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <textarea
                    value={fullAddress}
                    onChange={(e) =>
                      setFullAddress(
                        e.target.value
                      )
                    }
                    placeholder={
                      insideDhaka
                        ? "House / Road / Block / Nearby Location"
                        : "House / Village / Road / Nearby Location"
                    }
                    className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none transition focus:border-[#FFD1B5] focus:bg-white"
                  />
                </section>

                <div className="my-7 h-px bg-gray-100" />

                {/* PAYMENT */}

                <section>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor:
                          SOFT_ORANGE,
                      }}
                    >
                      <CreditCard
                        size={20}
                        style={{
                          color: ORANGE,
                        }}
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-gray-900">
                        Payment Method
                      </h2>

                      <p className="text-xs text-gray-400">
                        Select how you want to pay
                      </p>
                    </div>
                  </div>

                  {/* ADD PAYMENT */}

                  <button
                    type="button"
                    onClick={
                      goToPaymentSettings
                    }
                    className="mt-5 flex w-full items-center justify-between rounded-2xl border border-dashed border-[#FFD1B5] px-4 py-4 transition active:scale-[0.99]"
                    style={{
                      backgroundColor:
                        SOFT_ORANGE,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <Plus
                          size={20}
                          style={{
                            color: ORANGE,
                          }}
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">
                          Add Payment Method
                        </p>

                        <p className="text-[11px] text-gray-500">
                          bKash, Nagad, Rocket,
                          Upay, Bank or Card
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-xs font-bold"
                      style={{
                        color: ORANGE,
                      }}
                    >
                      Profile
                    </span>
                  </button>

                  {/* CASH */}

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "Cash on Delivery"
                      )
                    }
                    className="mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99]"
                    style={{
                      borderColor:
                        paymentMethod ===
                        "Cash on Delivery"
                          ? "#FFD1B5"
                          : "#F1F1F1",

                      backgroundColor:
                        paymentMethod ===
                        "Cash on Delivery"
                          ? SOFT_ORANGE
                          : "#FAFAFA",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <Banknote
                          size={20}
                          style={{
                            color: ORANGE,
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Cash on Delivery
                        </p>

                        <p className="text-[11px] text-gray-500">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>

                    {paymentMethod ===
                      "Cash on Delivery" && (
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          backgroundColor:
                            ORANGE,
                        }}
                      >
                        <Check
                          size={15}
                          className="text-white"
                        />
                      </div>
                    )}
                  </button>

                  {/* SAVED METHODS */}

                  {savedPaymentMethods.length >
                    0 && (
                    <div className="mt-3 space-y-3">
                      {savedPaymentMethods.map(
                        (method, index) => {
                          const label =
                            formatPaymentMethod(
                              method
                            );

                          const number =
                            getPaymentNumber(
                              method
                            );

                          const Icon =
                            getPaymentIcon(
                              method
                            );

                          const selected =
                            isSamePaymentMethod(
                              paymentMethod,
                              method
                            );

                          return (
                            <button
                              type="button"
                              key={
                                method?.id ||
                                `${label}-${number}-${index}`
                              }
                              onClick={() =>
                                setPaymentMethod(
                                  method
                                )
                              }
                              className="flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99]"
                              style={{
                                borderColor:
                                  selected
                                    ? "#FFD1B5"
                                    : "#F1F1F1",

                                backgroundColor:
                                  selected
                                    ? SOFT_ORANGE
                                    : "#FAFAFA",
                              }}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                                  <Icon
                                    size={19}
                                    style={{
                                      color:
                                        ORANGE,
                                    }}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-gray-900">
                                    {label}
                                  </p>

                                  {number && (
                                    <p className="mt-0.5 truncate text-xs text-gray-500">
                                      {number}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {selected && (
                                <div
                                  className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                  style={{
                                    backgroundColor:
                                      ORANGE,
                                  }}
                                >
                                  <Check
                                    size={15}
                                    className="text-white"
                                  />
                                </div>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* NO PAYMENT */}

                  {savedPaymentMethods.length ===
                    0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowPaymentHint(
                          (prev) => !prev
                        )
                      }
                      className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-left text-xs text-gray-500"
                    >
                      <ShieldCheck
                        size={16}
                        className="shrink-0 text-gray-400"
                      />

                      <span>
                        Add a payment method from
                        Profile to see it here.
                      </span>
                    </button>
                  )}

                  {showPaymentHint && (
                    <div className="mt-2 rounded-2xl border border-orange-100 bg-orange-50 p-3 text-xs text-orange-700">
                      Tap “Add Payment Method”
                      above to manage your saved
                      payment options.
                    </div>
                  )}
                </section>

                <div className="my-7 h-px bg-gray-100" />

                {/* ORDER SUMMARY */}

                <section>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-gray-900">
                      Order Summary
                    </h2>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-500">
                      {cart.length}{" "}
                      {cart.length === 1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                              style={{
                                backgroundColor:
                                  SOFT_ORANGE,
                              }}
                            >
                              <ShoppingBag
                                size={18}
                                style={{
                                  color:
                                    ORANGE,
                                }}
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-800">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Qty:{" "}
                              {item.qty || 1}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-black text-gray-800">
                          ৳{" "}
                          {(
                            (Number(
                              item.price
                            ) || 0) *
                            (Number(
                              item.qty
                            ) || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="my-5 h-px bg-gray-100" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-bold text-gray-800">
                        ৳{" "}
                        {Number(
                          totalPrice
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Delivery Charge
                      </span>

                      <span className="font-bold text-gray-800">
                        ৳{" "}
                        {deliveryCharge.toFixed(
                          2
                        )}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Promo Discount
                        </span>

                        <span
                          className="font-bold"
                          style={{
                            color: ORANGE,
                          }}
                        >
                          - ৳{" "}
                          {discount.toFixed(
                            2
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="my-5 h-px bg-gray-100" />

                  <div className="flex items-end justify-between">
                    <span className="text-base font-bold text-gray-800">
                      Total
                    </span>

                    <span className="text-2xl font-black text-gray-900">
                      ৳{" "}
                      {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </section>
              </div>

              {/* PLACE ORDER */}

              <div className="border-t border-gray-100 p-5 sm:p-7">
                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={handleOrder}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-[22px] py-4 text-base font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor:
                      SOFT_ORANGE,
                    color: ORANGE,
                  }}
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />

                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Truck size={21} />

                      Place Order • ৳{" "}
                      {grandTotal.toFixed(2)}
                    </>
                  )}
                </motion.button>

                <p className="mt-3 text-center text-[10px] text-gray-400">
                  By placing this order, you agree
                  to our delivery terms.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

