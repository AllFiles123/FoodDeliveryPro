import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    home: "Home",
    search: "Search",
    favourites: "Favourites",
    orders: "Orders",
    profile: "Profile",
    cart: "Cart",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    location: "Location",
    addresses: "My Addresses",
    continue: "Continue",
    cancel: "Cancel",
    save: "Save",
    add: "Add",
    remove: "Remove",
    checkout: "Checkout",
  },

  bn: {
    home: "হোম",
    search: "সার্চ",
    favourites: "পছন্দের",
    orders: "অর্ডার",
    profile: "প্রোফাইল",
    cart: "কার্ট",
    login: "লগইন",
    signup: "সাইন আপ",
    logout: "লগআউট",
    location: "লোকেশন",
    addresses: "আমার ঠিকানা",
    continue: "চালিয়ে যান",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    add: "যোগ করুন",
    remove: "সরান",
    checkout: "চেকআউট",
  },

  hi: {
    home: "होम",
    search: "खोजें",
    favourites: "पसंदीदा",
    orders: "ऑर्डर",
    profile: "प्रोफ़ाइल",
    cart: "कार्ट",
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉगआउट",
    location: "स्थान",
    addresses: "मेरे पते",
    continue: "जारी रखें",
    cancel: "रद्द करें",
    save: "सहेजें",
    add: "जोड़ें",
    remove: "हटाएँ",
    checkout: "चेकआउट",
  },

  ar: {
    home: "الرئيسية",
    search: "بحث",
    favourites: "المفضلة",
    orders: "الطلبات",
    profile: "الملف الشخصي",
    cart: "السلة",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل الخروج",
    location: "الموقع",
    addresses: "عناويني",
    continue: "متابعة",
    cancel: "إلغاء",
    save: "حفظ",
    add: "إضافة",
    remove: "إزالة",
    checkout: "الدفع",
  },

  ur: {
    home: "ہوم",
    search: "تلاش",
    favourites: "پسندیدہ",
    orders: "آرڈرز",
    profile: "پروفائل",
    cart: "کارٹ",
    login: "لاگ ان",
    signup: "سائن اپ",
    logout: "لاگ آؤٹ",
    location: "مقام",
    addresses: "میرے پتے",
    continue: "جاری رکھیں",
    cancel: "منسوخ",
    save: "محفوظ کریں",
    add: "شامل کریں",
    remove: "ہٹائیں",
    checkout: "چیک آؤٹ",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "bn"
  );

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const next =
        event.detail ||
        localStorage.getItem("selectedLanguage") ||
        "bn";

      setLanguage(next);
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
      );
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;

    document.documentElement.dir =
      language === "ar" || language === "ur"
        ? "rtl"
        : "ltr";
  }, [language]);

  const value = useMemo(() => {
    const dictionary =
      translations[language] ||
      translations.en;

    const t = (key) =>
      dictionary[key] ||
      translations.en[key] ||
      key;

    const changeLanguage = (nextLanguage) => {
      localStorage.setItem(
        "selectedLanguage",
        nextLanguage
      );

      setLanguage(nextLanguage);

      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: nextLanguage,
        })
      );
    };

    return {
      language,
      t,
      changeLanguage,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
