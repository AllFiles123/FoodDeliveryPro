import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";
import OrderSuccessAnimation from "../../components/animations/OrderSuccessAnimation";

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
    Gazipur: [
      "Tongi",
      "Gazipur Sadar",
      "Kaliakair",
    ],
    Dhaka: [
      "Savar",
      "Keraniganj",
      "Dohar",
    ],
    Narayanganj: [
      "Narayanganj Sadar",
      "Rupganj",
    ],
  },

  Chattogram: {
    Chattogram: [
      "Pahartali",
      "Panchlaish",
      "Kotwali",
    ],
    CoxsBazar: [
      "Coxs Bazar Sadar",
      "Teknaf",
    ],
  },

  Rajshahi: {
    Rajshahi: [
      "Rajshahi Sadar",
      "Paba",
    ],
  },
};

const SOFT_ORANGE = "#FFF3EA";
const ORANGE = "#FF8A4C";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const {
    cart,
    totalPrice,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  /*
   * ON  = Inside Dhaka
   * OFF = Outside Dhaka
   */
  const [insideDhaka, setInsideDhaka] =
    useState(true);

  const [zone, setZone] = useState("");

  const [division, setDivision] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [upazila, setUpazila] =
    useState("");

  const [fullAddress, setFullAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [savedPaymentMethods, setSavedPaymentMethods] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  /*
   * Checkout page body class.
   * This also prevents scrolling underneath the
   * checkout screen.
   */
  useEffect(() => {
    document.body.classList.add(
      "checkout-page"
    );

    document.body.style.overflowX = "hidden";

    return () => {
      document.body.classList.remove(
        "checkout-page"
      );

      document.body.style.overflowX = "";
    };
  }, []);

  /*
   * Load saved payment methods.
   */
  useEffect(() => {
    const loadPaymentMethods = () => {
      const keys = [
        "paymentMethods",
        "savedPaymentMethods",
        "userPaymentMethods",
        "profilePaymentMethods",
      ];

      let found = [];

      for (const key of keys) {
        try {
          const raw =
            localStorage.getItem(key);

          if (!raw) continue;

          const parsed =
            JSON.parse(raw);

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

  const deliveryType = insideDhaka
    ? "Dhaka Inside"
    : "Outside Dhaka";

  const deliveryCharge = insideDhaka
    ? 60
    : 120;

  /*
   * VAT removed.
   */
  const vat = 0;

  /*
   * Read promo discount.
   */
  const getPromoDiscount = () => {
    const keys = [
      "promoDiscount",
      "cartDiscount",
      "discount",
      "promo_discount",
    ];

    for (const key of keys) {
      const raw =
        localStorage.getItem(key);

      if (
        raw !== null &&
        raw !== ""
      ) {
        const value = Number(raw);

        if (
          !Number.isNaN(value) &&
          value > 0
        ) {
          return value;
        }
      }
    }

    return 0;
  };

  const discount = getPromoDiscount();

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

  const handleInsideToggle = () => {
    const next = !insideDhaka;

    setInsideDhaka(next);

    /*
     * Clear old location data when
     * switching between Inside/Outside.
     */
    setZone("");
    setDivision("");
    setDistrict("");
    setUpazila("");
    setFullAddress("");
  };

  /*
   * No popup.
   * Go directly to Profile.
   */
  const goToPaymentSettings = () => {
    navigate("/profile", {
      state: {
        openPaymentMethods: true,
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

    return (
      method.number ||
      method.phone ||
      method.accountNumber ||
      method.mobileNumber ||
      method.account ||
      ""
    );
  };

  const getPaymentIcon = (
    method
  ) => {
    const name =
      formatPaymentMethod(
        method
      ).toLowerCase();

    if (name.includes("cash")) {
      return Banknote;
    }

    return CreditCard;
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (
      !customerName ||
      !customerPhone
    ) {
      alert(
        "Please enter customer information"
      );
      return;
    }

    if (
      insideDhaka &&
      (!zone || !fullAddress)
    ) {
      alert(
        "Please complete delivery address"
      );
      return;
    }

    if (
      !insideDhaka &&
      (
        !division ||
        !district ||
        !upazila ||
        !fullAddress
      )
    ) {
      alert(
        "Please complete location information"
      );
      return;
    }

    try {
      setLoading(true);

      await orderService.createOrder({
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image || "",
          price: item.price,
          quantity: item.qty || 1,
        })),

        restaurantName:
          cart[0]?.restaurantName || "",

        customerName,
        customerPhone,

        deliveryType,

        zone,

        division,
        district,
        upazila,

        fullAddress,

        subtotal: totalPrice,

        vat: 0,

        discount,

        totalAmount: grandTotal,

        paymentMethod,

        paymentStatus:
          paymentMethod ===
          "Cash on Delivery"
            ? "Pending"
            : "Paid",

        orderStatus:
          "Pending",

        address: fullAddress,

        deliveryCharge,
      });

      clearCart();

      [
        "promoDiscount",
        "cartDiscount",
        "discount",
        "promo_discount",
      ].forEach((key) => {
        localStorage.removeItem(key);
      });

      setShowSuccess(true);
    } catch (error) {
      console.error(error);

      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 
        IMPORTANT:
        Checkout page-এর নিজের কোনো BottomNav নেই.
        নিচের CSS common fixed BottomNav থাকলে
        সেটাকেও hide করবে.
      */}

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
        `}
      </style>

      {showSuccess && (
        <OrderSuccessAnimation
          onClose={() =>
            navigate("/orders")
          }
        />
      )}

      <div className="min-h-screen bg-[#F8F8F8] px-4 pb-8 pt-5">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-3xl"
        >
          {/* HEADER */}

          <div className="mb-6 flex items-center">
            <button
              onClick={() =>
                navigate(-1)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
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

          {/* ONE CARD */}

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
                    className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none focus:border-[#FFD1B5] focus:bg-white"
                  />

                  <div className="flex items-center rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4">
                    <Phone
                      size={18}
                      style={{
                        color: ORANGE,
                      }}
                    />

                    <input
                      value={
                        customerPhone
                      }
                      onChange={(e) =>
                        setCustomerPhone(
                          e.target.value
                        )
                      }
                      placeholder="Phone Number"
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

                {/* SWITCH */}

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

                {insideDhaka && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="mt-5"
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
                        className="w-full appearance-none rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none focus:border-[#FFD1B5]"
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
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="mt-5 space-y-3"
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
                      className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none focus:border-[#FFD1B5]"
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
                      className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none disabled:opacity-50 focus:border-[#FFD1B5]"
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
                      className="w-full rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none disabled:opacity-50 focus:border-[#FFD1B5]"
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
                  className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-gray-100 bg-[#FAFAFA] px-4 py-4 text-sm outline-none focus:border-[#FFD1B5]"
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
                  className="mt-5 flex w-full items-center justify-between rounded-2xl border border-dashed border-[#FFD1B5] px-4 py-4 active:scale-[0.99]"
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
                        Add bKash, Nagad, Rocket,
                        Upay or Bank
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

                {/* CASH ON DELIVERY */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "Cash on Delivery"
                    )
                  }
                  className="mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 active:scale-[0.99]"
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

                    <div className="text-left">
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

                {/* SAVED PAYMENT METHODS */}

                {savedPaymentMethods.length >
                  0 && (
                  <div className="mt-3 space-y-3">
                    {savedPaymentMethods.map(
                      (
                        method,
                        index
                      ) => {
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
                          paymentMethod ===
                          method;

                        return (
                          <button
                            type="button"
                            key={
                              method?.id ||
                              `${label}-${index}`
                            }
                            onClick={() =>
                              setPaymentMethod(
                                method
                              )
                            }
                            className="flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left active:scale-[0.99]"
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
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                <Icon
                                  size={19}
                                  style={{
                                    color:
                                      ORANGE,
                                  }}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {label}
                                </p>

                                {number && (
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {number}
                                  </p>
                                )}
                              </div>
                            </div>

                            {selected && (
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
                        );
                      }
                    )}
                  </div>
                )}
              </section>

              <div className="my-7 h-px bg-gray-100" />

              {/* ORDER SUMMARY */}

              <section>
                <h2 className="text-lg font-black text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-800">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Qty: {item.qty}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-black text-gray-800">
                        ৳{" "}
                        {(
                          item.price *
                          item.qty
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
                      {totalPrice.toFixed(
                        2
                      )}
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
                    {grandTotal.toFixed(
                      2
                    )}
                  </span>
                </div>
              </section>
            </div>

            {/* PLACE ORDER */}

            <div className="border-t border-gray-100 p-5 sm:p-7">
              <motion.button
                whileTap={{
                  scale: 0.98,
                }}
                onClick={handleOrder}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-[22px] py-4 text-base font-black shadow-sm disabled:opacity-60"
                style={{
                  backgroundColor:
                    SOFT_ORANGE,
                  color: ORANGE,
                }}
              >
                <Truck size={21} />

                {loading
                  ? "Placing Order..."
                  : `Place Order • ৳ ${grandTotal.toFixed(
                      2
                    )}`}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
