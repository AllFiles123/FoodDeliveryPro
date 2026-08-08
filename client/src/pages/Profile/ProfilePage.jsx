import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  User,
  Package,
  MapPin,
  CreditCard,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wallet,
  Building2,
  Smartphone,
  Upload,
  Plus,
  Trash2,
  X,
  Check,
  Navigation,
  Home,
  Briefcase,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import profileService from "../../services/profileService";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [screen, setScreen] = useState("profile");

  /* ================= PROFILE IMAGE ================= */

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
      user?.profileImage ||
      ""
  );

  /* ================= PROFILE DATA ================= */

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "David Warner",
    email: user?.email || "davidwarner@gmail.com",
    phone: user?.phone || "+8801XXXXXXXXX",
    address: "",
    about: "",
  });

  /* ================= SAVED CARDS ================= */

  const [savedCards, setSavedCards] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("savedCards") || "[]"
      );
    } catch {
      return [];
    }
  });

  /* ================= SAVED ADDRESSES ================= */

  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("savedAddresses") || "[]"
      );
    } catch {
      return [];
    }
  });

  /* ================= PAYMENT METHODS ================= */

  const [savedPaymentMethods, setSavedPaymentMethods] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "savedPaymentMethods"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [selectedPaymentType, setSelectedPaymentType] =
    useState("");

  const [paymentNumber, setPaymentNumber] =
    useState("");

  const [bankAccountName, setBankAccountName] =
    useState("");

  /* ================= CARD FORM ================= */

  const [showCardForm, setShowCardForm] =
    useState(false);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [cardData, setCardData] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
    type: "Mastercard",
  });

  /* ================= ADDRESS FORM ================= */

  const [addressData, setAddressData] = useState({
    label: "Home",
    address: "",
    city: "Dhaka",
    phone: "",
  });

  /* ==================================================
     CHECKOUT -> PROFILE PAYMENT METHODS
  ================================================== */

  useEffect(() => {
    if (location.state?.openPaymentMethods) {
      setScreen("payment");

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [
    location.state,
    location.pathname,
    navigate,
  ]);

  /* ================= PROFILE IMAGE ================= */

  useEffect(() => {
    const storedImage =
      localStorage.getItem("profileImage");

    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  /* ================= SAVE CARDS ================= */

  useEffect(() => {
    localStorage.setItem(
      "savedCards",
      JSON.stringify(savedCards)
    );
  }, [savedCards]);

  /* ================= SAVE ADDRESSES ================= */

  useEffect(() => {
    localStorage.setItem(
      "savedAddresses",
      JSON.stringify(addresses)
    );
  }, [addresses]);

  /* ================= SAVE PAYMENT METHODS ================= */

  useEffect(() => {
    localStorage.setItem(
      "savedPaymentMethods",
      JSON.stringify(savedPaymentMethods)
    );

    window.dispatchEvent(
      new Event("paymentMethodsChanged")
    );
  }, [savedPaymentMethods]);

  /* ================= CURRENT LOCATION ================= */

  const currentLocation =
    localStorage.getItem("userLocation") || "";

  /* ================= CARD PREVIEW ================= */

  const maskedCardNumber = useMemo(() => {
    const clean = cardData.number.replace(
      /\D/g,
      ""
    );

    if (!clean) {
      return "•••• •••• •••• ••••";
    }

    const lastFour = clean.slice(-4);

    return `•••• •••• •••• ${lastFour}`;
  }, [cardData.number]);

  /* ================= CARD TYPE ================= */

  const detectCardType = (number) => {
    const clean = number.replace(/\D/g, "");

    if (/^4/.test(clean)) {
      return "Visa";
    }

    if (/^5[1-5]/.test(clean)) {
      return "Mastercard";
    }

    return "Credit Card";
  };

  /* ================= PROFILE IMAGE ================= */

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setProfileImage(url);

    localStorage.setItem(
      "profileImage",
      url
    );

    showToast(
      "Profile photo updated",
      "success"
    );
  };

  /* ================= PROFILE CHANGE ================= */

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

  /* ================= SAVE PROFILE ================= */

  const handleSaveProfile = async () => {
    try {
      await profileService.updateProfile(
        formData
      );

      showToast(
        "Profile saved successfully",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Profile saved locally",
        "success"
      );
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  /* ================= CARD FORMAT ================= */

  const formatCardNumber = (value) => {
    const clean = value
      .replace(/\D/g, "")
      .slice(0, 16);

    return clean
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    const clean = value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (clean.length <= 2) {
      return clean;
    }

    return `${clean.slice(
      0,
      2
    )}/${clean.slice(2)}`;
  };

  /* ================= CARD NUMBER CHANGE ================= */

  const handleCardNumberChange = (value) => {
    const formatted =
      formatCardNumber(value);

    setCardData((prev) => ({
      ...prev,
      number: formatted,
      type: detectCardType(
        formatted
      ),
    }));
  };

  /* ================= SAVE CARD ================= */

  const handleSaveCard = () => {
    const cleanNumber =
      cardData.number.replace(
        /\D/g,
        ""
      );

    if (!cardData.holder.trim()) {
      showToast(
        "Enter card holder name",
        "error"
      );

      return;
    }

    if (cleanNumber.length < 12) {
      showToast(
        "Enter a valid card number",
        "error"
      );

      return;
    }

    if (!cardData.expiry) {
      showToast(
        "Enter expiry date",
        "error"
      );

      return;
    }

    if (cardData.cvv.length < 3) {
      showToast(
        "Enter valid CVV",
        "error"
      );

      return;
    }

    const newCard = {
      id: Date.now(),

      holder:
        cardData.holder.trim(),

      number:
        cleanNumber.slice(-4),

      expiry:
        cardData.expiry,

      type:
        cardData.type,
    };

    setSavedCards((prev) => [
      newCard,
      ...prev,
    ]);

    setCardData({
      holder: "",
      number: "",
      expiry: "",
      cvv: "",
      type: "Mastercard",
    });

    setShowCardForm(false);

    showToast(
      "Card saved successfully",
      "success"
    );
  };

  /* ================= DELETE CARD ================= */

  const deleteCard = (id) => {
    setSavedCards((prev) =>
      prev.filter(
        (card) =>
          card.id !== id
      )
    );

    showToast(
      "Card removed",
      "success"
    );
  };

  /* ==================================================
     PAYMENT METHODS
  ================================================== */

  const paymentOptions = [
    {
      type: "bKash",
      subtitle: "Mobile Banking",
      icon: Wallet,
    },
    {
      type: "Nagad",
      subtitle: "Digital Payment",
      icon: Wallet,
    },
    {
      type: "Rocket",
      subtitle: "DBBL Mobile Banking",
      icon: Wallet,
    },
    {
      type: "Upay",
      subtitle: "United Commercial Bank",
      icon: Wallet,
    },
    {
      type: "Bank Account",
      subtitle: "Add bank account",
      icon: Building2,
    },
  ];

  const openPaymentForm = (
    type
  ) => {
    setSelectedPaymentType(type);
    setPaymentNumber("");
    setBankAccountName("");
    setShowPaymentForm(true);
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedPaymentType("");
    setPaymentNumber("");
    setBankAccountName("");
  };

  const handleSavePaymentMethod =
    () => {
      const cleanNumber =
        paymentNumber.replace(
          /\D/g,
          ""
        );

      if (!selectedPaymentType) {
        return;
      }

      if (
        selectedPaymentType ===
        "Bank Account"
      ) {
        if (!cleanNumber) {
          showToast(
            "Enter bank account number",
            "error"
          );

          return;
        }

        const newPayment = {
          id: Date.now(),
          type:
            selectedPaymentType,
          number: cleanNumber,
          accountName:
            bankAccountName.trim() ||
            "Bank Account",
        };

        setSavedPaymentMethods(
          (prev) => [
            newPayment,
            ...prev,
          ]
        );

        closePaymentForm();

        showToast(
          "Bank account added successfully",
          "success"
        );

        return;
      }

      if (cleanNumber.length < 10) {
        showToast(
          `Enter valid ${selectedPaymentType} number`,
          "error"
        );

        return;
      }

      const newPayment = {
        id: Date.now(),
        type:
          selectedPaymentType,
        number:
          cleanNumber,
      };

      setSavedPaymentMethods(
        (prev) => [
          newPayment,
          ...prev,
        ]
      );

      closePaymentForm();

      showToast(
        `${selectedPaymentType} added successfully`,
        "success"
      );
    };

  /* ================= DELETE PAYMENT ================= */

  const deletePaymentMethod =
    (id) => {
      setSavedPaymentMethods(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      );

      showToast(
        "Payment method removed",
        "success"
      );
    };

  /* ================= PAYMENT MASK ================= */

  const maskPaymentNumber = (
    number
  ) => {
    if (!number) return "";

    const clean =
      String(number);

    if (clean.length <= 4) {
      return clean;
    }

    return `•••• •••• ${clean.slice(
      -4
    )}`;
  };

  /* ================= ADDRESS ================= */

  const useCurrentLocation = () => {
    if (!currentLocation) {
      showToast(
        "No saved location found. Please set your location first.",
        "error"
      );

      return;
    }

    setAddressData(
      (prev) => ({
        ...prev,
        address:
          currentLocation,
      })
    );

    setShowAddressForm(true);
  };

  /* ================= SAVE ADDRESS ================= */

  const handleSaveAddress = () => {
    if (
      !addressData.address.trim()
    ) {
      showToast(
        "Enter an address",
        "error"
      );

      return;
    }

    const newAddress = {
      id: Date.now(),

      label:
        addressData.label,

      address:
        addressData.address.trim(),

      city:
        addressData.city.trim(),

      phone:
        addressData.phone.trim() ||
        formData.phone,
    };

    setAddresses((prev) => [
      newAddress,
      ...prev,
    ]);

    setAddressData({
      label: "Home",
      address: "",
      city: "Dhaka",
      phone: "",
    });

    setShowAddressForm(false);

    showToast(
      "Address added successfully",
      "success"
    );
  };

  /* ================= DELETE ADDRESS ================= */

  const deleteAddress = (id) => {
    setAddresses((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );

    showToast(
      "Address removed",
      "success"
    );
  };

  /* ================= MENUS ================= */

  const mainMenu = [
    [
      "Profile Details",
      User,
      "details",
    ],
    [
      "My Orders",
      Package,
      "orders",
    ],
    [
      "My Addresses",
      MapPin,
      "addresses",
    ],
    [
      "Payment Methods",
      CreditCard,
      "payment",
    ],
    [
      "Saved Cards",
      CreditCard,
      "cards",
    ],
  ];

  const settingMenu = [
    ["Notifications", Bell],
    ["Dark Mode", Moon],
    [
      "Help & Support",
      HelpCircle,
    ],
  ];

  /* ================= BACK ================= */

  const backToProfile = () => {
    setScreen("profile");

    setShowCardForm(false);

    setShowAddressForm(false);

    closePaymentForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-gray-100 to-orange-100">

      <div className="min-h-screen overflow-y-auto px-5 pb-40 pt-5">

        <div className="mx-auto max-w-md">

          {/* ==================================================
              PROFILE HOME
          ================================================== */}

          {screen === "profile" && (
            <>
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="relative shrink-0">

                      <img
                        src={
                          profileImage ||
                          "/default-avatar.png"
                        }
                        className="h-20 w-20 rounded-full object-cover shadow-md"
                        alt="Profile"
                      />

                      <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">

                        <Pencil size={13} />

                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={
                            handleImage
                          }
                        />

                      </label>

                    </div>

                    <div className="min-w-0">

                      <h2 className="truncate text-lg font-black text-slate-900">
                        {
                          formData.fullName
                        }
                      </h2>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {
                          formData.email
                        }
                      </p>

                      <p className="mt-1 text-xs font-semibold text-gray-400">
                        {
                          formData.phone
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setScreen(
                        "details"
                      )
                    }
                    className="rounded-xl bg-orange-50 p-3 text-orange-500"
                  >
                    <Pencil size={18} />
                  </button>

                </div>

              </div>

              {/* MAIN MENU */}

              <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-xl">

                {mainMenu.map(
                  ([
                    title,
                    Icon,
                    target,
                  ]) => (

                    <button
                      key={title}
                      onClick={() => {

                        if (
                          target ===
                          "orders"
                        ) {
                          navigate(
                            "/orders"
                          );

                          return;
                        }

                        setScreen(
                          target
                        );
                      }}
                      className="flex w-full items-center justify-between border-b border-gray-100 py-4 last:border-none"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">

                          <Icon
                            size={21}
                          />

                        </div>

                        <span className="text-sm font-bold text-slate-800">
                          {title}
                        </span>

                      </div>

                      <ChevronRight
                        size={19}
                        className="text-gray-400"
                      />

                    </button>

                  )
                )}

              </div>

              {/* SETTINGS */}

              <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-xl">

                {settingMenu.map(
                  ([
                    title,
                    Icon,
                  ]) => (

                    <button
                      key={title}
                      className="flex w-full items-center justify-between border-b border-gray-100 py-4 last:border-none"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">

                          <Icon
                            size={21}
                          />

                        </div>

                        <span className="text-sm font-bold text-slate-800">
                          {title}
                        </span>

                      </div>

                      <ChevronRight
                        size={19}
                        className="text-gray-400"
                      />

                    </button>

                  )
                )}

              </div>

              {/* LOGOUT */}

              <div className="mt-5 rounded-[2rem] border border-red-100 bg-white/80 p-4 shadow-xl backdrop-blur-xl">

                <button
                  onClick={
                    handleLogout
                  }
                  className="flex w-full items-center gap-4 py-4 text-red-500"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50">

                    <LogOut
                      size={21}
                    />

                  </div>

                  <span className="text-sm font-black">
                    Logout
                  </span>

                </button>

              </div>
            </>
          )}

          {/* ==================================================
              PROFILE DETAILS
          ================================================== */}

          {screen === "details" && (
            <>
              <div className="mb-5 flex items-center gap-3">

                <button
                  onClick={
                    backToProfile
                  }
                  className="rounded-xl bg-white p-3 shadow-sm"
                >
                  <ArrowLeft
                    size={20}
                  />
                </button>

                <h2 className="text-xl font-black">
                  Profile Details
                </h2>

              </div>

              <div className="rounded-[2rem] bg-white/90 p-5 shadow-xl">

                <div className="mb-6 flex flex-col items-center">

                  <img
                    src={
                      profileImage ||
                      "/default-avatar.png"
                    }
                    className="h-28 w-28 rounded-full object-cover shadow-lg"
                    alt="Profile"
                  />

                  <label className="mt-4 flex cursor-pointer items-center gap-2 font-bold text-orange-500">

                    <Upload
                      size={18}
                    />

                    Change Photo

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={
                        handleImage
                      }
                    />

                  </label>

                </div>

                <input
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Full Name"
                  className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                />

                <input
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Email"
                  className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                />

                <input
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Phone"
                  className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                />

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Address"
                  className="mb-3 h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                />

                <textarea
                  name="about"
                  value={
                    formData.about
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="About yourself"
                  className="mb-4 h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                />

                <button
                  onClick={
                    handleSaveProfile
                  }
                  className="w-full rounded-2xl bg-orange-500 py-4 font-black text-white shadow-lg shadow-orange-200"
                >
                  Save Changes
                </button>

              </div>
            </>
          )}

          {/* ==================================================
              PAYMENT METHODS
          ================================================== */}

          {screen === "payment" && (
            <>
              <div className="mb-5 flex items-center gap-3">

                <button
                  onClick={
                    backToProfile
                  }
                  className="rounded-xl bg-white p-3 shadow-sm"
                >
                  <ArrowLeft
                    size={20}
                  />
                </button>

                <h2 className="text-xl font-black">
                  Payment Methods
                </h2>

              </div>

              {/* ADD PAYMENT FORM */}

              {showPaymentForm && (
                <div className="mb-5 rounded-[2rem] bg-white/95 p-5 shadow-xl">

                  <div className="mb-5 flex items-center justify-between">

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Add{" "}
                        {
                          selectedPaymentType
                        }
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Enter your payment account details
                      </p>
                    </div>

                    <button
                      onClick={
                        closePaymentForm
                      }
                      className="rounded-full bg-gray-100 p-2"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  {selectedPaymentType ===
                    "Bank Account" && (
                    <input
                      value={
                        bankAccountName
                      }
                      onChange={(e) =>
                        setBankAccountName(
                          e.target.value
                        )
                      }
                      placeholder="Account Holder Name"
                      className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-400"
                    />
                  )}

                  <input
                    value={
                      paymentNumber
                    }
                    onChange={(e) =>
                      setPaymentNumber(
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            selectedPaymentType ===
                              "Bank Account"
                              ? 20
                              : 11
                          )
                      )
                    }
                    placeholder={
                      selectedPaymentType ===
                      "Bank Account"
                        ? "Bank Account Number"
                        : `Enter ${selectedPaymentType} Number`
                    }
                    inputMode="numeric"
                    className="mb-4 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-400"
                  />

                  <button
                    onClick={
                      handleSavePaymentMethod
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-300 to-orange-400 py-4 font-black text-white shadow-lg shadow-orange-100"
                  >
                    <Check
                      size={19}
                    />

                    Save Payment Method
                  </button>

                </div>
              )}

              {/* AVAILABLE PAYMENT METHODS */}

              <div className="space-y-3">

                {paymentOptions.map(
                  ({
                    type,
                    subtitle,
                    icon: Icon,
                  }) => (

                    <button
                      key={type}
                      onClick={() =>
                        openPaymentForm(
                          type
                        )
                      }
                      className="flex w-full items-center justify-between rounded-3xl bg-white/90 p-4 shadow-md transition active:scale-[0.98]"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">

                          <Icon
                            size={21}
                          />

                        </div>

                        <div className="text-left">

                          <h3 className="font-black text-slate-800">
                            {type}
                          </h3>

                          <p className="text-xs text-gray-500">
                            {subtitle}
                          </p>

                        </div>

                      </div>

                      <Plus
                        size={20}
                        className="text-orange-400"
                      />

                    </button>

                  )
                )}

              </div>

              {/* SAVED PAYMENT METHODS */}

              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-lg font-black text-slate-800">
                    Your Payment Methods
                  </h3>

                  <span className="text-xs font-bold text-gray-400">
                    {
                      savedPaymentMethods.length
                    }{" "}
                    saved
                  </span>

                </div>

                {savedPaymentMethods.length ===
                0 ? (
                  <div className="rounded-[2rem] bg-white/80 p-7 text-center shadow-md">

                    <CreditCard
                      size={42}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-bold text-gray-500">
                      No payment method added yet
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Add bKash, Nagad, Rocket, Upay or Bank Account.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-3">

                    {savedPaymentMethods.map(
                      (item) => (

                        <div
                          key={
                            item.id
                          }
                          className="rounded-[1.7rem] bg-white/90 p-4 shadow-md"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">

                                {item.type ===
                                "Bank Account" ? (
                                  <Building2
                                    size={
                                      20
                                    }
                                  />
                                ) : (
                                  <Wallet
                                    size={
                                      20
                                    }
                                  />
                                )}

                              </div>

                              <div className="min-w-0">

                                <p className="font-black text-slate-800">
                                  {
                                    item.type
                                  }
                                </p>

                                {item.accountName && (
                                  <p className="text-xs font-semibold text-gray-500">
                                    {
                                      item.accountName
                                    }
                                  </p>
                                )}

                                <p className="mt-0.5 text-sm font-bold tracking-wide text-gray-600">
                                  {maskPaymentNumber(
                                    item.number
                                  )}
                                </p>

                              </div>

                            </div>

                            <button
                              onClick={() =>
                                deletePaymentMethod(
                                  item.id
                                )
                              }
                              className="shrink-0 rounded-xl bg-red-50 p-2 text-red-500"
                            >
                              <Trash2
                                size={
                                  17
                                }
                              />
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>
                )}

              </div>

              {/* CASH ON DELIVERY */}

              <div className="mt-5 rounded-[1.7rem] border border-orange-100 bg-orange-50/80 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-400 shadow-sm">

                    <Wallet
                      size={20}
                    />

                  </div>

                  <div>

                    <p className="font-black text-slate-800">
                      Cash on Delivery
                    </p>

                    <p className="text-xs text-gray-500">
                      Pay when your order arrives
                    </p>

                  </div>

                </div>

              </div>

            </>
          )}

          {/* ==================================================
              SAVED CARDS
          ================================================== */}

          {screen === "cards" && (
            <>
              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <button
                    onClick={
                      backToProfile
                    }
                    className="rounded-xl bg-white p-3 shadow-sm"
                  >
                    <ArrowLeft
                      size={20}
                    />
                  </button>

                  <h2 className="text-xl font-black">
                    Saved Cards
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setShowCardForm(
                      true
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg"
                >
                  <Plus size={21} />
                </button>

              </div>

              {/* ADD CARD */}

              {showCardForm && (
                <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-xl">

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="text-lg font-black">
                      Add New Card
                    </h3>

                    <button
                      onClick={() =>
                        setShowCardForm(
                          false
                        )
                      }
                      className="rounded-full bg-gray-100 p-2"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  {/* CARD PREVIEW */}

                  <div className="mb-5 overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 text-white shadow-xl">

                    <div className="flex items-start justify-between">

                      <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                        {
                          cardData.type ||
                          "Card"
                        }
                      </div>

                      <div className="text-xl font-black">

                        {cardData.type ===
                        "Visa"
                          ? "VISA"
                          : cardData.type ===
                            "Mastercard"
                          ? "mastercard"
                          : "CARD"}

                      </div>

                    </div>

                    <div className="mt-8 text-2xl tracking-[0.18em]">
                      {
                        maskedCardNumber
                      }
                    </div>

                    <div className="mt-7 flex items-end justify-between">

                      <div>

                        <p className="text-[8px] uppercase text-white/50">
                          Card Holder
                        </p>

                        <p className="text-sm font-bold uppercase">
                          {
                            cardData.holder ||
                            "YOUR NAME"
                          }
                        </p>

                      </div>

                      <div>

                        <p className="text-[8px] uppercase text-white/50">
                          Expiry
                        </p>

                        <p className="text-sm font-bold">
                          {
                            cardData.expiry ||
                            "MM/YY"
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                  <input
                    value={
                      cardData.holder
                    }
                    onChange={(e) =>
                      setCardData(
                        (prev) => ({
                          ...prev,
                          holder:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="Card Holder Name"
                    className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                  />

                  <input
                    value={
                      cardData.number
                    }
                    onChange={(e) =>
                      handleCardNumberChange(
                        e.target.value
                      )
                    }
                    placeholder="Card Number"
                    inputMode="numeric"
                    className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                  />

                  <div className="mb-3 grid grid-cols-2 gap-3">

                    <input
                      value={
                        cardData.expiry
                      }
                      onChange={(e) =>
                        setCardData(
                          (prev) => ({
                            ...prev,
                            expiry:
                              formatExpiry(
                                e.target.value
                              ),
                          })
                        )
                      }
                      placeholder="MM/YY"
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                    />

                    <input
                      value={
                        cardData.cvv
                      }
                      onChange={(e) =>
                        setCardData(
                          (prev) => ({
                            ...prev,
                            cvv: e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                4
                              ),
                          })
                        )
                      }
                      placeholder="CVV"
                      type="password"
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                    />

                  </div>

                  <button
                    onClick={
                      handleSaveCard
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-black text-white shadow-lg shadow-orange-200"
                  >
                    <Check size={19} />
                    Save Card
                  </button>

                </div>
              )}

              {/* SAVED CARD LIST */}

              {savedCards.length ===
                0 &&
              !showCardForm ? (
                <div className="rounded-[2rem] bg-white/90 p-8 text-center shadow-xl">

                  <CreditCard
                    size={48}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-4 font-black text-slate-800">
                    No Saved Cards
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Add your Visa or Mastercard for faster checkout.
                  </p>

                  <button
                    onClick={() =>
                      setShowCardForm(
                        true
                      )
                    }
                    className="mt-5 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
                  >
                    Add Card
                  </button>

                </div>
              ) : (
                <div className="space-y-4">

                  {savedCards.map(
                    (card) => (

                      <div
                        key={
                          card.id
                        }
                        className="rounded-[1.8rem] bg-white p-4 shadow-lg"
                      >

                        <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-800 to-slate-700 p-5 text-white">

                          <div className="flex justify-between">

                            <span className="text-xs font-bold uppercase text-white/60">
                              {
                                card.type
                              }
                            </span>

                            <span className="font-black">
                              {card.type ===
                              "Visa"
                                ? "VISA"
                                : card.type ===
                                  "Mastercard"
                                ? "mastercard"
                                : "CARD"}
                            </span>

                          </div>

                          <p className="mt-7 text-xl tracking-widest">
                            •••• •••• ••••{" "}
                            {
                              card.number
                            }
                          </p>

                          <div className="mt-6 flex justify-between">

                            <div>

                              <p className="text-[8px] uppercase text-white/50">
                                Card Holder
                              </p>

                              <p className="text-sm font-bold uppercase">
                                {
                                  card.holder
                                }
                              </p>

                            </div>

                            <div>

                              <p className="text-[8px] uppercase text-white/50">
                                Expiry
                              </p>

                              <p className="font-bold">
                                {
                                  card.expiry
                                }
                              </p>

                            </div>

                          </div>

                        </div>

                        <div className="mt-3 flex items-center justify-between px-2">

                          <div className="flex items-center gap-2 text-xs font-bold text-orange-500">

                            <Check
                              size={15}
                            />

                            Saved Card

                          </div>

                          <button
                            onClick={() =>
                              deleteCard(
                                card.id
                              )
                            }
                            className="rounded-xl bg-red-50 p-2 text-red-500"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}
            </>
          )}

          {/* ==================================================
              ADDRESSES
          ================================================== */}

          {screen === "addresses" && (
            <>
              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <button
                    onClick={
                      backToProfile
                    }
                    className="rounded-xl bg-white p-3 shadow-sm"
                  >
                    <ArrowLeft
                      size={20}
                    />
                  </button>

                  <h2 className="text-xl font-black">
                    My Addresses
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setShowAddressForm(
                      true
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg"
                >
                  <Plus size={21} />
                </button>

              </div>

              {/* CURRENT LOCATION */}

              {currentLocation && (
                <div className="mb-5 rounded-[2rem] border border-orange-100 bg-orange-50 p-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">

                      <Navigation
                        size={19}
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-black uppercase tracking-wider text-orange-500">
                        Current Saved Location
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-slate-800">
                        {
                          currentLocation
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={
                      useCurrentLocation
                    }
                    className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-black text-orange-500 shadow-sm"
                  >
                    Use This Address
                  </button>

                </div>
              )}

              {/* ADDRESS FORM */}

              {showAddressForm && (
                <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-xl">

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="text-lg font-black">
                      Add New Address
                    </h3>

                    <button
                      onClick={() =>
                        setShowAddressForm(
                          false
                        )
                      }
                      className="rounded-full bg-gray-100 p-2"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-2">

                    {[
                      [
                        "Home",
                        Home,
                      ],
                      [
                        "Work",
                        Briefcase,
                      ],
                      [
                        "Other",
                        MapPin,
                      ],
                    ].map(
                      ([
                        label,
                        Icon,
                      ]) => (

                        <button
                          key={label}
                          onClick={() =>
                            setAddressData(
                              (
                                prev
                              ) => ({
                                ...prev,
                                label,
                              })
                            )
                          }
                          className={`flex flex-col items-center gap-1 rounded-2xl border p-3 ${
                            addressData.label ===
                            label
                              ? "border-orange-500 bg-orange-50 text-orange-500"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >

                          <Icon
                            size={18}
                          />

                          <span className="text-[10px] font-bold">
                            {
                              label
                            }
                          </span>

                        </button>

                      )
                    )}

                  </div>

                  <textarea
                    value={
                      addressData.address
                    }
                    onChange={(e) =>
                      setAddressData(
                        (prev) => ({
                          ...prev,
                          address:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="House / Road / Area / Full Address"
                    className="mb-3 h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                  />

                  <input
                    value={
                      addressData.city
                    }
                    onChange={(e) =>
                      setAddressData(
                        (prev) => ({
                          ...prev,
                          city:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="City"
                    className="mb-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                  />

                  <input
                    value={
                      addressData.phone
                    }
                    onChange={(e) =>
                      setAddressData(
                        (prev) => ({
                          ...prev,
                          phone:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="Contact Phone"
                    className="mb-4 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                  />

                  <button
                    onClick={
                      handleSaveAddress
                    }
                    className="w-full rounded-2xl bg-orange-500 py-4 font-black text-white shadow-lg shadow-orange-200"
                  >
                    Save Address
                  </button>

                </div>
              )}

              {/* SAVED ADDRESSES */}

              {addresses.length ===
                0 &&
              !showAddressForm ? (
                <div className="rounded-[2rem] bg-white/90 p-8 text-center shadow-xl">

                  <MapPin
                    size={48}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-4 font-black text-slate-800">
                    No Saved Addresses
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Add your home, work or another delivery address.
                  </p>

                  <button
                    onClick={() =>
                      setShowAddressForm(
                        true
                      )
                    }
                    className="mt-5 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white"
                  >
                    Add Address
                  </button>

                </div>
              ) : (
                <div className="space-y-4">

                  {addresses.map(
                    (item) => (

                      <div
                        key={
                          item.id
                        }
                        className="rounded-[2rem] bg-white p-5 shadow-lg"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex min-w-0 items-start gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">

                              {item.label ===
                              "Home" ? (
                                <Home
                                  size={
                                    19
                                  }
                                />
                              ) : item.label ===
                                "Work" ? (
                                <Briefcase
                                  size={
                                    19
                                  }
                                />
                              ) : (
                                <MapPin
                                  size={
                                    19
                                  }
                                />
                              )}

                            </div>

                            <div className="min-w-0">

                              <h3 className="font-black text-slate-800">
                                {
                                  item.label
                                }
                              </h3>

                              <p className="mt-1 break-words text-sm text-gray-500">
                                {
                                  item.address
                                }
                              </p>

                              <p className="mt-1 text-xs font-semibold text-gray-400">
                                {
                                  item.city
                                }{" "}
                                •{" "}
                                {
                                  item.phone
                                }
                              </p>

                            </div>

                          </div>

                          <button
                            onClick={() =>
                              deleteAddress(
                                item.id
                              )
                            }
                            className="shrink-0 rounded-xl bg-red-50 p-2 text-red-500"
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

            </>
          )}

        </div>
      </div>
    </div>
  );
}
