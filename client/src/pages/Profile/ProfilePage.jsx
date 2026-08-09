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
  Sun,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wallet,
  Building2,
  Upload,
  Plus,
  Trash2,
  X,
  Check,
  Navigation,
  Home,
  Briefcase,
  Tag,
  Gift,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Settings,
  Copy,
  Clock3,
  CircleCheck,
  CircleX,
  ShoppingBag,
  Receipt,
  Palette,
  ChevronDown,
  TicketPercent,
  Headphones,
  LockKeyhole,
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

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
      user?.profileImage ||
      ""
  );

  /* =========================================================
     PROFILE DATA
  ========================================================= */

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "David Warner",
    email: user?.email || "davidwarner@gmail.com",
    phone: user?.phone || "+8801XXXXXXXXX",
    address: "",
    about: "",
  });

  /* =========================================================
     PROFILE CONFIRM STATE
  ========================================================= */

  const [profileSaving, setProfileSaving] = useState(false);

  /* =========================================================
     SAVED CARDS
  ========================================================= */

  const [savedCards, setSavedCards] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("savedCards") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [showCardForm, setShowCardForm] = useState(false);

  const [cardData, setCardData] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
    location: "Bangladesh",
    zipCode: "",
    type: "Credit Card",
  });

  const [saveCardInformation, setSaveCardInformation] =
    useState(true);

  const [cardSaving, setCardSaving] = useState(false);

  /* =========================================================
     ADDRESSES
  ========================================================= */

  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("savedAddresses") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  const [addressData, setAddressData] = useState({
    label: "Home",
    address: "",
    city: "Dhaka",
    phone: "",
  });

  /* =========================================================
     PAYMENT METHODS
  ========================================================= */

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

  const [paymentSaving, setPaymentSaving] =
    useState(false);

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const [notifications, setNotifications] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "notifications"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  /* =========================================================
     PROMOS
  ========================================================= */

  const [promoCodes, setPromoCodes] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "savedPromoCodes"
        ) || "[]"
      );
    } catch {
      return [];
    }
  });

  const [promoInput, setPromoInput] = useState("");

  const defaultPromos = [
    {
      id: "WELCOME20",
      code: "WELCOME20",
      title: "Welcome Offer",
      description:
        "Get 20% off on your next food order.",
      discount: "20% OFF",
      minimum: "Minimum order ৳499",
      active: true,
    },
    {
      id: "FOOD50",
      code: "FOOD50",
      title: "Foodie Special",
      description:
        "Save ৳50 on selected restaurants.",
      discount: "৳50 OFF",
      minimum: "Minimum order ৳399",
      active: true,
    },
    {
      id: "FREEDEL",
      code: "FREEDEL",
      title: "Free Delivery",
      description:
        "Enjoy free delivery on eligible orders.",
      discount: "FREE DELIVERY",
      minimum: "Selected restaurants",
      active: true,
    },
  ];

  /* =========================================================
     THEMES
  ========================================================= */

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("appTheme") ||
      "light"
    );
  });

  const themes = [
    {
      id: "light",
      name: "Classic Light",
      description:
        "Clean and bright experience",
      preview:
        "bg-gradient-to-br from-white via-orange-50 to-orange-100",
    },
    {
      id: "dark",
      name: "Midnight",
      description:
        "Elegant dark experience",
      preview:
        "bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950",
    },
    {
      id: "sunset",
      name: "Sunset",
      description:
        "Warm food-delivery inspired look",
      preview:
        "bg-gradient-to-br from-orange-300 via-amber-200 to-rose-200",
    },
    {
      id: "ocean",
      name: "Ocean",
      description:
        "Fresh and modern interface",
      preview:
        "bg-gradient-to-br from-cyan-300 via-sky-200 to-blue-300",
    },
    {
      id: "forest",
      name: "Forest",
      description:
        "Calm natural interface",
      preview:
        "bg-gradient-to-br from-emerald-300 via-green-200 to-lime-200",
    },
    {
      id: "lavender",
      name: "Lavender",
      description:
        "Soft premium appearance",
      preview:
        "bg-gradient-to-br from-purple-300 via-violet-200 to-pink-200",
    },
  ];

  /* =========================================================
     CHECKOUT -> PROFILE PAYMENT
  ========================================================= */

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

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  useEffect(() => {
    const storedImage =
      localStorage.getItem("profileImage");

    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  /* =========================================================
     LOCAL STORAGE
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "savedCards",
      JSON.stringify(savedCards)
    );
  }, [savedCards]);

  useEffect(() => {
    localStorage.setItem(
      "savedAddresses",
      JSON.stringify(addresses)
    );
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(
      "savedPaymentMethods",
      JSON.stringify(savedPaymentMethods)
    );

    window.dispatchEvent(
      new Event("paymentMethodsChanged")
    );
  }, [savedPaymentMethods]);

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(
      "savedPromoCodes",
      JSON.stringify(promoCodes)
    );
  }, [promoCodes]);

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "appTheme",
      theme
    );

    document.documentElement.dataset.theme =
      theme;

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  /* =========================================================
     CURRENT LOCATION
  ========================================================= */

  const currentLocation =
    localStorage.getItem(
      "userLocation"
    ) || "";

  /* =========================================================
     IMAGE
  ========================================================= */

  const handleImage = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const url =
      URL.createObjectURL(file);

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

  /* =========================================================
     PROFILE
  ========================================================= */

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));
  };

  const handleSaveProfile =
    async () => {
      if (profileSaving) return;

      try {
        setProfileSaving(true);

        await profileService.updateProfile(
          formData
        );

        showToast(
          "Profile updated successfully",
          "success"
        );
      } catch (error) {
        console.error(error);

        showToast(
          "Profile saved locally",
          "success"
        );
      } finally {
        setProfileSaving(false);
      }
    };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================================================
     CARD DETECTION
  ========================================================= */

  const detectCardType = (number) => {
    const clean =
      String(number || "")
        .replace(/\D/g, "");

    if (/^4/.test(clean)) {
      return "Visa";
    }

    if (
      /^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/.test(
        clean
      )
    ) {
      return "Mastercard";
    }

    if (
      /^(34|37)/.test(clean)
    ) {
      return "American Express";
    }

    if (
      /^(6011|65|64[4-9])/.test(
        clean
      )
    ) {
      return "Discover";
    }

    if (
      /^(35)/.test(clean)
    ) {
      return "JCB";
    }

    return "Credit / Debit Card";
  };

  const luhnCheck = (number) => {
    const digits =
      String(number || "")
        .replace(/\D/g, "");

    if (
      digits.length < 12 ||
      digits.length > 19
    ) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (
      let i = digits.length - 1;
      i >= 0;
      i--
    ) {
      let digit =
        Number(digits[i]);

      if (shouldDouble) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const formatCardNumber = (
    value
  ) => {
    const clean =
      value
        .replace(/\D/g, "")
        .slice(0, 19);

    return clean
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (
    value
  ) => {
    const clean =
      value
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

  const handleCardNumberChange =
    (value) => {
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

  const maskedCardNumber =
    useMemo(() => {
      const clean =
        cardData.number.replace(
          /\D/g,
          ""
        );

      if (!clean) {
        return "•••• •••• •••• ••••";
      }

      const groups = [];

      for (
        let i = 0;
        i < clean.length;
        i += 4
      ) {
        groups.push(
          clean.slice(i, i + 4)
        );
      }

      return groups
        .map((group, index) => {
          if (
            index ===
            groups.length - 1
          ) {
            return group;
          }

          return "••••";
        })
        .join(" ");
    }, [cardData.number]);

  const handleSaveCard = () => {
    if (cardSaving) return;

    const cleanNumber =
      cardData.number.replace(/\D/g, "");

    if (!cardData.holder.trim()) {
      showToast(
        "Enter card holder name",
        "error"
      );
      return;
    }

    if (!luhnCheck(cleanNumber)) {
      showToast(
        "Enter a valid card number",
        "error"
      );
      return;
    }

    if (
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
        cardData.expiry
      )
    ) {
      showToast(
        "Enter expiry as MM/YY",
        "error"
      );
      return;
    }

    if (
      cardData.cvv.length <
      (cardData.type === "American Express"
        ? 4
        : 3)
    ) {
      showToast(
        "Enter valid CVV",
        "error"
      );
      return;
    }

    if (!cardData.location.trim()) {
      showToast(
        "Select your location",
        "error"
      );
      return;
    }

    if (
      cardData.zipCode &&
      !/^\d{3,10}$/.test(
        cardData.zipCode
      )
    ) {
      showToast(
        "Enter a valid ZIP code",
        "error"
      );
      return;
    }

    setCardSaving(true);

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
      location:
        cardData.location.trim(),
      zipCode:
        cardData.zipCode.trim(),
      savedInformation:
        saveCardInformation,
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
      location: "Bangladesh",
      zipCode: "",
      type: "Credit Card",
    });

    setSaveCardInformation(true);

    setShowCardForm(false);

    setTimeout(() => {
      setCardSaving(false);
    }, 300);

    showToast(
      `${newCard.type} saved successfully`,
      "success"
    );
  };

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

  /* =========================================================
     PAYMENT METHODS
  ========================================================= */

  const paymentOptions = [
    {
      type: "bKash",
      subtitle:
        "Mobile Banking",
      icon: Smartphone,
    },
    {
      type: "Nagad",
      subtitle:
        "Digital Payment",
      icon: Smartphone,
    },
    {
      type: "Rocket",
      subtitle:
        "DBBL Mobile Banking",
      icon: Smartphone,
    },
    {
      type: "Upay",
      subtitle:
        "United Commercial Bank",
      icon: Smartphone,
    },
    {
      type: "Bank Account",
      subtitle:
        "Add bank account",
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
      if (paymentSaving) return;

      const cleanNumber =
        paymentNumber.replace(
          /\D/g,
          ""
        );

      if (
        selectedPaymentType ===
        "Bank Account"
      ) {
        if (
          cleanNumber.length <
          8
        ) {
          showToast(
            "Enter a valid bank account number",
            "error"
          );
          return;
        }

        setPaymentSaving(true);

        const newPayment = {
          id: Date.now(),
          type:
            selectedPaymentType,
          number:
            cleanNumber,
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

        setTimeout(
          () =>
            setPaymentSaving(
              false
            ),
          300
        );

        return;
      }

      if (
        cleanNumber.length < 10
      ) {
        showToast(
          `Enter valid ${selectedPaymentType} number`,
          "error"
        );
        return;
      }

      setPaymentSaving(true);

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

      setTimeout(
        () =>
          setPaymentSaving(
            false
          ),
        300
      );
    };

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

  /* =========================================================
     ADDRESS
  ========================================================= */

  const useCurrentLocation = () => {
    if (!currentLocation) {
      showToast(
        "No saved location found",
        "error"
      );
      return;
    }

    setAddressData((prev) => ({
      ...prev,
      address:
        currentLocation,
    }));

    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (addressSaving) return;

    if (
      !addressData.address.trim()
    ) {
      showToast(
        "Enter an address",
        "error"
      );
      return;
    }

    setAddressSaving(true);

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

    setTimeout(
      () =>
        setAddressSaving(false),
      300
    );
  };

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

  /* =========================================================
     NOTIFICATION HELPERS
  ========================================================= */

  const unreadNotifications =
    notifications.filter(
      (item) => !item.read
    ).length;

  const notificationIcon = (
    type
  ) => {
    if (
      type === "order_received" ||
      type === "order_confirmed"
    ) {
      return CircleCheck;
    }

    if (
      type === "order_cancelled"
    ) {
      return CircleX;
    }

    if (
      type === "payment"
    ) {
      return CreditCard;
    }

    if (
      type === "promo"
    ) {
      return Tag;
    }

    return Bell;
  };

  const notificationTarget = (
    item
  ) => {
    if (
      item.target === "order" ||
      item.type?.startsWith(
        "order_"
      )
    ) {
      if (item.orderId) {
        navigate(
          `/orders/${item.orderId}`
        );
      } else {
        navigate("/orders");
      }

      return;
    }

    if (
      item.target === "payment" ||
      item.type === "payment"
    ) {
      setScreen("payment");
      return;
    }

    if (
      item.target === "promo" ||
      item.type === "promo"
    ) {
      setScreen("promos");
      return;
    }

    if (
      item.target === "profile"
    ) {
      setScreen("details");
      return;
    }
  };

  const openNotification = (
    item
  ) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id ===
        item.id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );

    notificationTarget(item);
  };

  const markAllNotificationsRead =
    () => {
      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );
    };

  /* =========================================================
     PROMOS
  ========================================================= */

  const allPromos = [
    ...defaultPromos,
    ...promoCodes,
  ];

  const copyPromo = async (
    code
  ) => {
    try {
      await navigator.clipboard.writeText(
        code
      );

      showToast(
        `${code} copied`,
        "success"
      );
    } catch {
      showToast(
        "Promo code copied",
        "success"
      );
    }
  };

  const savePromo = (promo) => {
    const exists =
      promoCodes.some(
        (item) =>
          item.code ===
          promo.code
      );

    if (exists) {
      showToast(
        "Promo already saved",
        "success"
      );
      return;
    }

    setPromoCodes((prev) => [
      ...prev,
      promo,
    ]);

    showToast(
      "Promo saved successfully",
      "success"
    );
  };

  const applyPromo = () => {
    const code =
      promoInput
        .trim()
        .toUpperCase();

    if (!code) {
      showToast(
        "Enter a promo code",
        "error"
      );
      return;
    }

    const promo =
      allPromos.find(
        (item) =>
          item.code === code
      );

    if (!promo) {
      showToast(
        "Promo code not found",
        "error"
      );
      return;
    }

    localStorage.setItem(
      "selectedPromoCode",
      promo.code
    );

    window.dispatchEvent(
      new Event("promoChanged")
    );

    showToast(
      `${promo.code} applied`,
      "success"
    );
  };

  /* =========================================================
     BACK
  ========================================================= */

  const backToProfile = () => {
    setScreen("profile");
    setShowCardForm(false);
    setShowAddressForm(false);
    closePaymentForm();
  };

  /* =========================================================
     MENU
  ========================================================= */

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
    [
      "Promo & Offers",
      Tag,
      "promos",
    ],
  ];

  /* =========================================================
     THEME CLASSES
  ========================================================= */

  const pageBackground =
    theme === "dark"
      ? "bg-slate-950 text-white"
      : theme === "ocean"
      ? "bg-gradient-to-br from-sky-50 via-white to-cyan-50"
      : theme === "forest"
      ? "bg-gradient-to-br from-emerald-50 via-white to-lime-50"
      : theme === "lavender"
      ? "bg-gradient-to-br from-violet-50 via-white to-pink-50"
      : theme === "sunset"
      ? "bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50"
      : "bg-gradient-to-br from-pink-50 via-gray-50 to-orange-50";

  const cardBackground =
    theme === "dark"
      ? "border border-white/10 bg-slate-900/90"
      : "border border-white/70 bg-white/85";

  const textMain =
    theme === "dark"
      ? "text-white"
      : "text-slate-900";

  const textSecondary =
    theme === "dark"
      ? "text-slate-400"
      : "text-gray-500";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${pageBackground}`}
    >
      <div className="min-h-screen overflow-y-auto px-5 pb-40 pt-5">
        <div className="mx-auto max-w-md">

          {/* ==================================================
              PROFILE HOME
          ================================================== */}

          {screen === "profile" && (
            <>
              <div
                className={`rounded-[2rem] p-5 shadow-xl backdrop-blur-xl ${cardBackground}`}
              >
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
                      <h2
                        className={`truncate text-lg font-black ${textMain}`}
                      >
                        {formData.fullName}
                      </h2>

                      <p
                        className={`mt-1 truncate text-sm ${textSecondary}`}
                      >
                        {formData.email}
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${textSecondary}`}
                      >
                        {formData.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setScreen("details")
                    }
                    className="rounded-xl bg-orange-50 p-3 text-orange-500"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              </div>

              {/* QUICK ACTIONS */}

              <div className="mt-5 grid grid-cols-3 gap-3">
                <button
                  onClick={() =>
                    setScreen("notifications")
                  }
                  className={`relative rounded-3xl p-4 text-center shadow-md ${cardBackground}`}
                >
                  <Bell
                    size={22}
                    className="mx-auto text-orange-500"
                  />

                  <p
                    className={`mt-2 text-[11px] font-black ${textMain}`}
                  >
                    Notifications
                  </p>

                  {unreadNotifications >
                    0 && (
                    <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-black text-white">
                      {unreadNotifications >
                      9
                        ? "9+"
                        : unreadNotifications}
                    </span>
                  )}
                </button>

                <button
                  onClick={() =>
                    setScreen("promos")
                  }
                  className={`rounded-3xl p-4 text-center shadow-md ${cardBackground}`}
                >
                  <Tag
                    size={22}
                    className="mx-auto text-orange-500"
                  />

                  <p
                    className={`mt-2 text-[11px] font-black ${textMain}`}
                  >
                    Offers
                  </p>
                </button>

                <button
                  onClick={() =>
                    setScreen("themes")
                  }
                  className={`rounded-3xl p-4 text-center shadow-md ${cardBackground}`}
                >
                  <Palette
                    size={22}
                    className="mx-auto text-orange-500"
                  />

                  <p
                    className={`mt-2 text-[11px] font-black ${textMain}`}
                  >
                    Themes
                  </p>
                </button>
              </div>

              {/* MAIN MENU */}

              <div
                className={`mt-6 overflow-hidden rounded-[2rem] p-4 shadow-xl backdrop-blur-xl ${cardBackground}`}
              >
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
                      className={`flex w-full items-center justify-between border-b py-4 last:border-none ${
                        theme ===
                        "dark"
                          ? "border-white/10"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* ORIGINAL ICON COLOUR */}

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
                          <Icon size={21} />
                        </div>

                        <span
                          className={`text-sm font-bold ${textMain}`}
                        >
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

              <div
                className={`mt-5 overflow-hidden rounded-[2rem] p-4 shadow-xl backdrop-blur-xl ${cardBackground}`}
              >
                <button
                  onClick={() =>
                    setScreen(
                      "notifications"
                    )
                  }
                  className={`flex w-full items-center justify-between border-b py-4 ${
                    theme === "dark"
                      ? "border-white/10"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
                      <Bell size={21} />
                    </div>

                    <span
                      className={`text-sm font-bold ${textMain}`}
                    >
                      Notifications
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadNotifications >
                      0 && (
                      <span className="rounded-full bg-orange-500 px-2 py-1 text-[9px] font-black text-white">
                        {
                          unreadNotifications
                        }
                      </span>
                    )}

                    <ChevronRight
                      size={19}
                      className="text-gray-400"
                    />
                  </div>
                </button>

                <button
                  onClick={() =>
                    setScreen("themes")
                  }
                  className={`flex w-full items-center justify-between border-b py-4 ${
                    theme === "dark"
                      ? "border-white/10"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
                      {theme ===
                      "dark" ? (
                        <Moon size={21} />
                      ) : (
                        <Sun size={21} />
                      )}
                    </div>

                    <span
                      className={`text-sm font-bold ${textMain}`}
                    >
                      Themes
                    </span>
                  </div>

                  <ChevronRight
                    size={19}
                    className="text-gray-400"
                  />
                </button>

                <button
                  onClick={() =>
                    setScreen(
                      "help"
                    )
                  }
                  className="flex w-full items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
                      <HelpCircle
                        size={21}
                      />
                    </div>

                    <span
                      className={`text-sm font-bold ${textMain}`}
                    >
                      Help & Support
                    </span>
                  </div>

                  <ChevronRight
                    size={19}
                    className="text-gray-400"
                  />
                </button>
              </div>

              {/* LOGOUT */}

              <div className="mt-5 rounded-[2rem] border border-red-100 bg-white/80 p-4 shadow-xl">
                <button
                  onClick={
                    handleLogout
                  }
                  className="flex w-full items-center gap-4 py-4 text-red-500"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50">
                    <LogOut size={21} />
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
              <div className="mb-5 flex items-center justify-between gap-3">
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

                  <h2
                    className={`text-xl font-black ${textMain}`}
                  >
                    Profile Details
                  </h2>
                </div>

                {/* SAVE BUTTON REMOVED -> CHECK */}

                <button
                  onClick={
                    handleSaveProfile
                  }
                  disabled={
                    profileSaving
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200 disabled:opacity-50"
                  title="Confirm changes"
                >
                  {profileSaving ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Check size={21} />
                  )}
                </button>
              </div>

              <div
                className={`rounded-[2rem] p-5 shadow-xl ${cardBackground}`}
              >
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
                    <Upload size={18} />
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
                  className="h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-orange-500"
                />
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

                <h2
                  className={`text-xl font-black ${textMain}`}
                >
                  Payment Methods
                </h2>
              </div>

              {/* PAYMENT FORM */}

              {showPaymentForm && (
                <div
                  className={`mb-5 rounded-[2rem] p-5 shadow-xl ${cardBackground}`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-lg font-black ${textMain}`}
                      >
                        Add{" "}
                        {
                          selectedPaymentType
                        }
                      </h3>

                      <p
                        className={`mt-1 text-xs ${textSecondary}`}
                      >
                        Securely save your payment account
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

                  {/* CHECK INSTEAD OF SAVE */}

                  <button
                    onClick={
                      handleSavePaymentMethod
                    }
                    disabled={
                      paymentSaving
                    }
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200 disabled:opacity-50"
                  >
                    {paymentSaving ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Check size={21} />
                    )}
                  </button>
                </div>
              )}

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
                      className={`flex w-full items-center justify-between rounded-3xl p-4 shadow-md transition active:scale-[0.98] ${cardBackground}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
                          <Icon size={21} />
                        </div>

                        <div className="text-left">
                          <h3
                            className={`font-black ${textMain}`}
                          >
                            {type}
                          </h3>

                          <p
                            className={`text-xs ${textSecondary}`}
                          >
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

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <h3
                    className={`text-lg font-black ${textMain}`}
                  >
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
                  <div
                    className={`rounded-[2rem] p-7 text-center shadow-md ${cardBackground}`}
                  >
                    <CreditCard
                      size={42}
                      className="mx-auto text-gray-300"
                    />

                    <p
                      className={`mt-3 text-sm font-bold ${textSecondary}`}
                    >
                      No payment method added yet
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
                          className={`rounded-[1.7rem] p-4 shadow-md ${cardBackground}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
                                {item.type ===
                                "Bank Account" ? (
                                  <Building2
                                    size={20}
                                  />
                                ) : (
                                  <Wallet
                                    size={20}
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={`font-black ${textMain}`}
                                >
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
                                size={17}
                              />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ==================================================
              SAVED CARDS
          ================================================== */}

          {screen === "cards" && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={backToProfile}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 active:scale-95"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-xl font-black ${textMain}`}
                  >
                    Saved Cards
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Manage your secure payment cards
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCardData({
                      holder: "",
                      number: "",
                      expiry: "",
                      cvv: "",
                      location: "Bangladesh",
                      zipCode: "",
                      type: "Credit Card",
                    });

                    setSaveCardInformation(true);
                    setShowCardForm(true);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200 active:scale-95"
                >
                  <Plus size={21} />
                </button>
              </div>

              {showCardForm && (
                <div className="mb-7 overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03]">

                  <div className="flex items-center gap-3 px-5 pb-4 pt-5">
                    <button
                      onClick={() =>
                        setShowCardForm(false)
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-700 active:scale-95"
                    >
                      <ArrowLeft size={19} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-gray-900">
                        Add New Card
                      </h3>

                      <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                        Securely save your payment card
                      </p>
                    </div>
                  </div>

                  {/* CARD PREVIEW */}

                  <div className="px-4">
                    <div className="relative mx-auto h-[205px] w-full max-w-[390px] overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#173d48] via-[#102f38] to-[#071b22] p-5 text-white shadow-xl">

                      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border-[30px] border-white/[0.035]" />

                      <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full border-[28px] border-white/[0.025]" />

                      <div className="relative flex h-full flex-col justify-between">

                        <div className="flex items-start justify-between">

                          <div className="h-8 w-11 overflow-hidden rounded-[7px] bg-gradient-to-br from-[#f7e8b5] via-[#c9b879] to-[#8d7d4e]">
                            <div className="mt-[8px] h-px bg-black/10" />
                            <div className="mt-1 h-px bg-black/10" />
                          </div>

                          <div className="text-right">
                            <p className="text-[22px] font-black italic">
                              {cardData.type === "Mastercard"
                                ? "MC"
                                : cardData.type === "American Express"
                                ? "AMEX"
                                : cardData.type === "Discover"
                                ? "DISCOVER"
                                : "VISA"}
                            </p>

                            <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/40">
                              {cardData.type}
                            </p>
                          </div>

                        </div>

                        <div>
                          <p className="whitespace-nowrap text-[18px] font-medium tracking-[0.12em] text-white/90">
                            {maskedCardNumber}
                          </p>

                          <div className="mt-4 flex items-end justify-between">

                            <div className="min-w-0">
                              <p className="text-[7px] uppercase tracking-[0.18em] text-white/40">
                                Card Holder
                              </p>

                              <p className="mt-0.5 max-w-[180px] truncate text-[11px] font-bold uppercase tracking-wide">
                                {cardData.holder ||
                                  "YOUR NAME"}
                              </p>
                            </div>

                            <div className="mr-2 text-right">
                              <p className="text-[7px] uppercase tracking-[0.18em] text-white/40">
                                Expires
                              </p>

                              <p className="mt-0.5 text-[11px] font-bold">
                                {cardData.expiry ||
                                  "MM/YY"}
                              </p>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 py-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <span className="h-1.5 w-4 rounded-full bg-gray-900" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                  </div>

                  {/* CARD INFORMATION */}

                  <div className="mx-4 mb-4 rounded-[1.5rem] bg-[#fafafa] p-4 ring-1 ring-black/[0.025]">

                    <div className="mb-4">
                      <h4 className="text-base font-black text-gray-900">
                        Card Information
                      </h4>

                      <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                        Enter your card details below
                      </p>
                    </div>

                    {/* CARD NUMBER */}

                    <div className="mb-4">
                      <label className="mb-1.5 block px-1 text-[11px] font-semibold text-gray-400">
                        Card Number
                      </label>

                      <div className="flex h-[54px] items-center rounded-xl border border-gray-200 bg-white px-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">

                        <input
                          value={cardData.number}
                          onChange={(e) =>
                            handleCardNumberChange(
                              e.target.value
                            )
                          }
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          className="min-w-0 flex-1 bg-transparent px-1 text-sm font-semibold tracking-wide text-gray-800 outline-none placeholder:text-gray-300"
                        />

                        <ShieldCheck
                          size={19}
                          className="shrink-0 text-gray-400"
                        />
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5 px-1">
                        <ShieldCheck
                          size={12}
                          className="text-green-500"
                        />

                        <span className="text-[9px] font-semibold text-gray-400">
                          {cardData.type} detected automatically
                        </span>
                      </div>
                    </div>

                    {/* HOLDER */}

                    <div className="mb-4">
                      <label className="mb-1.5 block px-1 text-[11px] font-semibold text-gray-400">
                        Account Holder Name
                      </label>

                      <input
                        value={cardData.holder}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            holder:
                              e.target.value,
                          }))
                        }
                        placeholder="Enter card holder name"
                        autoComplete="cc-name"
                        className="h-[54px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    {/* EXPIRY / CVV */}

                    <div className="mb-4 grid grid-cols-2 gap-3">

                      <div>
                        <label className="mb-1.5 block px-1 text-[11px] font-semibold text-gray-400">
                          Expire Date
                        </label>

                        <input
                          value={cardData.expiry}
                          onChange={(e) =>
                            setCardData((prev) => ({
                              ...prev,
                              expiry:
                                formatExpiry(
                                  e.target.value
                                ),
                            }))
                          }
                          placeholder="MM/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          className="h-[54px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block px-1 text-[11px] font-semibold text-gray-400">
                          CVV
                        </label>

                        <input
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData((prev) => ({
                              ...prev,
                              cvv:
                                e.target.value
                                  .replace(
                                    /\D/g,
                                    ""
                                  )
                                  .slice(
                                    0,
                                    cardData.type ===
                                      "American Express"
                                      ? 4
                                      : 3
                                  ),
                            }))
                          }
                          placeholder={
                            cardData.type ===
                            "American Express"
                              ? "CID"
                              : "CVV"
                          }
                          type="password"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          className="h-[54px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                    </div>

                    {/* LOCATION / ZIP */}

                    <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">

                      <div>
                        <label className="mb-1.5 block px-1 text-[11px] font-semibold text-gray-400">
                          Location
                        </label>

                        <div className="relative">
                          <MapPin
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />

                          <select
                            value={cardData.location}
                            onChange={(e) =>
                              setCardData((prev) => ({
                                ...prev,
                                location:
                                  e.target.value,
                              }))
                            }
                            className="h-[54px] w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-8 text-sm font-semibold text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          >
                            <option value="Bangladesh">
                              Bangladesh
                            </option>

                            <option value="Dhaka">
                              Dhaka
                            </option>

                            <option value="Chattogram">
                              Chattogram
                            </option>

                            <option value="Sylhet">
                              Sylhet
                            </option>

                            <option value="Rajshahi">
                              Rajshahi
                            </option>

                            <option value="Khulna">
                              Khulna
                            </option>
                          </select>

                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block px-1 text-[11px] font-semibold text-gray-400">
                          ZIP Code
                        </label>

                        <input
                          value={cardData.zipCode}
                          onChange={(e) =>
                            setCardData((prev) => ({
                              ...prev,
                              zipCode:
                                e.target.value
                                  .replace(
                                    /\D/g,
                                    ""
                                  )
                                  .slice(0, 10),
                            }))
                          }
                          placeholder="1207"
                          inputMode="numeric"
                          className="h-[54px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                    </div>

                    {/* CHECKBOX */}

                    <button
                      type="button"
                      onClick={() =>
                        setSaveCardInformation(
                          (prev) => !prev
                        )
                      }
                      className="mt-5 flex w-full items-center gap-3 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                          saveCardInformation
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {saveCardInformation && (
                          <Check
                            size={13}
                            strokeWidth={3}
                          />
                        )}
                      </span>

                      <span className="text-xs font-semibold text-gray-600">
                        Save Card Information
                      </span>
                    </button>
                  </div>

                  {/* ORANGE SAVE */}

                  <div className="px-4 pb-5">
                    <button
                      onClick={handleSaveCard}
                      disabled={cardSaving}
                      className="flex h-[58px] w-full items-center justify-center rounded-[1.2rem] bg-orange-500 text-base font-black text-white shadow-lg shadow-orange-200 transition active:scale-[0.985] hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cardSaving ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* EMPTY STATE */}

              {savedCards.length === 0 &&
              !showCardForm ? (
                <div className="rounded-[2rem] bg-white p-7 text-center shadow-lg ring-1 ring-black/[0.03]">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                    <CreditCard
                      size={30}
                      className="text-orange-500"
                    />
                  </div>

                  <h3
                    className={`mt-4 text-lg font-black ${textMain}`}
                  >
                    No Saved Cards
                  </h3>

                  <p className="mx-auto mt-1 max-w-[250px] text-sm leading-5 text-gray-400">
                    Save your card securely for a faster and smoother checkout.
                  </p>

                  <button
                    onClick={() =>
                      setShowCardForm(true)
                    }
                    className="mt-5 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 active:scale-95"
                  >
                    Add Card
                  </button>
                </div>
              ) : (
                <div className="space-y-4">

                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="overflow-hidden rounded-[1.8rem] bg-white p-4 shadow-lg ring-1 ring-black/[0.03]"
                    >

                      <div className="relative h-[185px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#173d48] via-[#102f38] to-[#071b22] p-5 text-white">

                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border-[24px] border-white/[0.035]" />

                        <div className="flex items-start justify-between">

                          <div className="h-7 w-10 rounded-md bg-gradient-to-br from-[#f7e8b5] to-[#8d7d4e]" />

                          <span className="text-lg font-black italic">
                            {card.type === "Mastercard"
                              ? "MC"
                              : card.type === "American Express"
                              ? "AMEX"
                              : card.type === "Discover"
                              ? "DISCOVER"
                              : "VISA"}
                          </span>

                        </div>

                        <div className="absolute bottom-5 left-5 right-5">

                          <p className="text-lg font-medium tracking-[0.12em]">
                            •••• •••• ••••{" "}
                            {card.number}
                          </p>

                          <div className="mt-4 flex items-end justify-between">

                            <div className="min-w-0">
                              <p className="text-[7px] uppercase tracking-widest text-white/40">
                                Card Holder
                              </p>

                              <p className="max-w-[190px] truncate text-[11px] font-bold uppercase">
                                {card.holder}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-[7px] uppercase tracking-widest text-white/40">
                                Expires
                              </p>

                              <p className="text-[11px] font-bold">
                                {card.expiry}
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-1 pt-3">

                        <div className="flex min-w-0 items-center gap-2">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                            <ShieldCheck
                              size={15}
                              className="text-green-500"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-800">
                              Securely Saved
                            </p>

                            <p className="truncate text-[9px] font-medium text-gray-400">
                              {card.location ||
                                "Bangladesh"}
                              {card.zipCode
                                ? ` • ${card.zipCode}`
                                : ""}
                            </p>
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            deleteCard(card.id)
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 active:scale-95"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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

                  <h2
                    className={`text-xl font-black ${textMain}`}
                  >
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

              {showAddressForm && (
                <div
                  className={`mb-6 rounded-[2rem] p-5 shadow-xl ${cardBackground}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className={`text-lg font-black ${textMain}`}
                    >
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
                      ["Home", Home],
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
                    disabled={
                      addressSaving
                    }
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg disabled:opacity-50"
                  >
                    {addressSaving ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Check size={21} />
                    )}
                  </button>
                </div>
              )}

              {addresses.length ===
                0 &&
              !showAddressForm ? (
                <div
                  className={`rounded-[2rem] p-8 text-center shadow-xl ${cardBackground}`}
                >
                  <MapPin
                    size={48}
                    className="mx-auto text-gray-300"
                  />

                  <h3
                    className={`mt-4 font-black ${textMain}`}
                  >
                    No Saved Addresses
                  </h3>

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
                        className={`rounded-[2rem] p-5 shadow-lg ${cardBackground}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                              {item.label ===
                              "Home" ? (
                                <Home
                                  size={19}
                                />
                              ) : item.label ===
                                "Work" ? (
                                <Briefcase
                                  size={19}
                                />
                              ) : (
                                <MapPin
                                  size={19}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3
                                className={`font-black ${textMain}`}
                              >
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
              NOTIFICATIONS PAGE
          ================================================== */}

          {screen ===
            "notifications" && (
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

                  <h2
                    className={`text-xl font-black ${textMain}`}
                  >
                    Notifications
                  </h2>
                </div>

                {notifications.length >
                  0 && (
                  <button
                    onClick={
                      markAllNotificationsRead
                    }
                    className="text-xs font-black text-orange-500"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length ===
              0 ? (
                <div
                  className={`rounded-[2rem] p-10 text-center shadow-xl ${cardBackground}`}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-500">
                    <Bell size={30} />
                  </div>

                  <h3
                    className={`mt-5 text-lg font-black ${textMain}`}
                  >
                    You're all caught up
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    New order updates, payment alerts and offers will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(
                    (item) => {
                      const Icon =
                        notificationIcon(
                          item.type
                        );

                      return (
                        <button
                          key={
                            item.id
                          }
                          onClick={() =>
                            openNotification(
                              item
                            )
                          }
                          className={`relative flex w-full gap-4 rounded-[1.7rem] p-4 text-left shadow-md transition active:scale-[0.99] ${cardBackground} ${
                            !item.read
                              ? "ring-1 ring-orange-200"
                              : ""
                          }`}
                        >
                          {!item.read && (
                            <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-orange-500" />
                          )}

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                            <Icon
                              size={22}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3
                                className={`text-sm font-black ${textMain}`}
                              >
                                {
                                  item.title
                                }
                              </h3>

                              <ChevronRight
                                size={17}
                                className="shrink-0 text-gray-400"
                              />
                            </div>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {
                                item.message
                              }
                            </p>

                            <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                              <Clock3
                                size={12}
                              />

                              {
                                item.time ||
                                item.createdAt ||
                                "Recently"
                              }
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </>
          )}

          {/* ==================================================
              PROMO PAGE
          ================================================== */}

          {screen === "promos" && (
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

                <h2
                  className={`text-xl font-black ${textMain}`}
                >
                  Promo & Offers
                </h2>
              </div>

              <div
                className={`mb-5 rounded-[2rem] p-5 shadow-xl ${cardBackground}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <TicketPercent
                      size={21}
                    />
                  </div>

                  <div>
                    <h3
                      className={`font-black ${textMain}`}
                    >
                      Have a promo code?
                    </h3>

                    <p className="text-xs text-gray-400">
                      Enter it before checkout.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    value={
                      promoInput
                    }
                    onChange={(e) =>
                      setPromoInput(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="ENTER PROMO CODE"
                    className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-bold outline-none focus:border-orange-500"
                  />

                  <button
                    onClick={
                      applyPromo
                    }
                    className="rounded-2xl bg-orange-500 px-5 font-black text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {allPromos.map(
                  (promo) => (
                    <div
                      key={
                        promo.id ||
                        promo.code
                      }
                      className={`relative overflow-hidden rounded-[2rem] p-5 shadow-lg ${cardBackground}`}
                    >
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-100/70" />

                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Gift
                                size={20}
                                className="text-orange-500"
                              />

                              <h3
                                className={`font-black ${textMain}`}
                              >
                                {
                                  promo.title
                                }
                              </h3>
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                              {
                                promo.description
                              }
                            </p>
                          </div>

                          <span className="rounded-xl bg-orange-50 px-3 py-2 text-[10px] font-black text-orange-500">
                            {
                              promo.discount
                            }
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-3">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              Promo Code
                            </p>

                            <p className="mt-1 font-black tracking-widest text-slate-800">
                              {
                                promo.code
                              }
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              copyPromo(
                                promo.code
                              )
                            }
                            className="rounded-xl bg-white p-2 text-orange-500 shadow-sm"
                          >
                            <Copy
                              size={17}
                            />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-gray-400">
                            {
                              promo.minimum
                            }
                          </span>

                          <button
                            onClick={() =>
                              savePromo(
                                promo
                              )
                            }
                            className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-black text-white"
                          >
                            Save Offer
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {/* ==================================================
              THEMES PAGE
          ================================================== */}

          {screen === "themes" && (
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

                <h2
                  className={`text-xl font-black ${textMain}`}
                >
                  Themes
                </h2>
              </div>

              {/* LIGHT / DARK SWITCH */}

              <div
                className={`rounded-[2rem] p-5 shadow-xl ${cardBackground}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                      {theme ===
                      "dark" ? (
                        <Moon size={21} />
                      ) : (
                        <Sun size={21} />
                      )}
                    </div>

                    <div>
                      <h3
                        className={`font-black ${textMain}`}
                      >
                        Appearance
                      </h3>

                      <p className="text-xs text-gray-400">
                        {theme ===
                        "dark"
                          ? "Dark mode"
                          : "Light mode"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setTheme(
                        theme ===
                          "dark"
                          ? "light"
                          : "dark"
                      )
                    }
                    className={`relative h-8 w-14 rounded-full transition ${
                      theme ===
                      "dark"
                        ? "bg-orange-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                        theme ===
                        "dark"
                          ? "left-7"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* MORE THEMES */}

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles
                    size={18}
                    className="text-orange-500"
                  />

                  <h3
                    className={`font-black ${textMain}`}
                  >
                    More Themes
                  </h3>
                </div>

                <div className="space-y-3">
                  {themes
                    .filter(
                      (item) =>
                        item.id !==
                        "light" &&
                        item.id !==
                        "dark"
                    )
                    .map(
                      (item) => (
                        <button
                          key={
                            item.id
                          }
                          onClick={() =>
                            setTheme(
                              item.id
                            )
                          }
                          className={`flex w-full items-center gap-4 rounded-[1.7rem] p-3 shadow-md transition active:scale-[0.99] ${
                            theme ===
                            item.id
                              ? "ring-2 ring-orange-500"
                              : ""
                          } ${cardBackground}`}
                        >
                          <div
                            className={`h-16 w-20 shrink-0 rounded-2xl ${item.preview}`}
                          />

                          <div className="min-w-0 flex-1 text-left">
                            <h4
                              className={`font-black ${textMain}`}
                            >
                              {
                                item.name
                              }
                            </h4>

                            <p className="mt-1 text-xs text-gray-400">
                              {
                                item.description
                              }
                            </p>
                          </div>

                          {theme ===
                            item.id && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                              <Check
                                size={
                                  17
                                }
                              />
                            </div>
                          )}
                        </button>
                      )
                    )}
                </div>
              </div>

              {/* DARK THEME */}

              <button
                onClick={() =>
                  setTheme("dark")
                }
                className={`mt-4 flex w-full items-center gap-4 rounded-[1.7rem] p-4 shadow-md ${
                  theme ===
                  "dark"
                    ? "ring-2 ring-orange-500"
                    : ""
                } ${cardBackground}`}
              >
                <div className="flex h-16 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800">
                  <Moon
                    size={26}
                    className="text-white"
                  />
                </div>

                <div className="flex-1 text-left">
                  <h4
                    className={`font-black ${textMain}`}
                  >
                    Midnight
                  </h4>

                  <p className="mt-1 text-xs text-gray-400">
                    Elegant dark experience
                  </p>
                </div>

                {theme ===
                  "dark" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Check
                      size={17}
                    />
                  </div>
                )}
              </button>
            </>
          )}

          {/* ==================================================
              HELP & SUPPORT
              INTENTIONALLY CLEAN / EMPTY
          ================================================== */}

          {screen === "help" && (
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

                <h2
                  className={`text-xl font-black ${textMain}`}
                >
                  Help & Support
                </h2>
              </div>

              <div
                className={`min-h-[55vh] rounded-[2rem] p-8 shadow-xl ${cardBackground}`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
