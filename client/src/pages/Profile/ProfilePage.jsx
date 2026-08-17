import { useRef, useEffect, useMemo, useState } from "react";
import {
  Pencil, User, Package, MapPin, CreditCard, Bell, Moon, Sun, HelpCircle, LogOut, Settings,
  ChevronRight, Wallet, Building2, Upload, Plus, Trash2, X, Check, Navigation,
  Home, Briefcase, Tag, Gift, ShieldCheck, Smartphone, Search, Globe, Heart, Power,
  Eye, EyeOff, Clock3, CircleCheck, CircleX, TicketPercent, FileText, ShieldAlert, Copy, Sparkles, ArrowLeft, ChevronDown
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import profileService from "../../services/profileService";


async function loadBackendProfile() {
  try {
    const response = await profileService.getProfile();

    if (response?.success && response?.user) {
      return response.user;
    }

    return null;
  } catch (error) {
    console.error("❌ Failed to load backend profile:", error);
    return null;
  }
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const { showToast } = useToast();

  const [screen, setScreen] = useState("profile");

  /* =========================================================
     STATE MANAGEMENT (FROM ORIGINAL FILE)
  ========================================================= */
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  const [backendProfile, setBackendProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "David Warner",
    email: user?.email || "davidwarner@gmail.com",
    phone: user?.phone || "+8801XXXXXXXXX",
    address: user?.address || "", 
    about: user?.about || "",
  });

  const [savedCards, setSavedCards] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");

  // Add Card Temp State (Original logic)
  const [cardData, setCardData] = useState({ holder: "", number: "", expiry: "", cvv: "", location: "Bangladesh", zipCode: "", type: "Visa" });
  const [addressData, setAddressData] = useState({ label: "Home", address: "", city: "Dhaka", phone: "" });
  const [mfsData, setMfsData] = useState({ type: "", number: "" });

  /* =========================================================
     CORE FUNCTIONS (ORIGINAL LOGIC)
  ========================================================= */
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      setProfileImage(url);
      showToast("Profile photo updated", "success");
    }
  };

  const handleProfileChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };

  const saveNewCard = () => {
    if (cardData.number.length < 15) return showToast("Enter valid card number", "error");
    const newCard = { ...cardData, id: Date.now(), number: cardData.number.slice(-4) };
    setSavedCards([newCard, ...savedCards]);
    setScreen("cards");
    showToast("Card saved successfully", "success");
  };

  const loadProfileFromBackend = async () => {
    try {
      const data = await profileService.getProfile();

      const profile = data?.user || {};

      if (typeof setProfileImage === "function") {
        setProfileImage(profile.profileImage || "");
      }

      if (typeof setAddresses === "function") {
        setAddresses(data?.addresses || []);
      }

      if (typeof setSavedPaymentMethods === "function") {
        setSavedPaymentMethods(data?.paymentMethods || []);
      }

      if (typeof setSavedCards === "function") {
        setSavedCards(data?.paymentMethods || []);
      }

      if (typeof setNotifications === "function") {
        setNotifications(data?.notifications || []);
      }

      if (typeof setTheme === "function") {
        setTheme(profile.theme || "light");
      }

      if (typeof setLanguage === "function") {
        setLanguage(profile.language || "English");
      }

      return data;
    } catch (error) {
      console.error("Profile backend load failed:", error);
      return null;
    }
  };


  useEffect(() => {
    loadProfileFromBackend();
  }, []);

  useEffect(() => {

    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [savedCards, addresses, savedPaymentMethods, theme]);

  /* =========================================================
     REUSABLE COMPONENTS
  ========================================================= */
  const CardWrapper = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 mb-5 ${className}`}>
      {children}
    </div>
  );

  const ListItem = ({ icon: Icon, title, subtitle, onClick, colorClass }) => (
    <button onClick={onClick} className="flex w-full items-center justify-between p-4 active:bg-gray-50 dark:active:bg-slate-800 border-b last:border-none border-gray-50 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 flex items-center justify-center rounded-full ${colorClass || 'bg-gray-100'}`}><Icon size={18} /></div>
        <div className="text-left">
          <p className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{title}</p>
          {subtitle && <p className="text-[11px] font-medium text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  );


  const displayProfile = backendProfile || user || {};


  const saveProfileToBackend = async (data) => {
    try {
      setProfileSaving(true);

      const response = await profileService.updateProfile({
        fullName: data?.fullName ?? displayProfile?.fullName ?? "",
        phone: data?.phone ?? displayProfile?.phone ?? "",
      });

      if (response?.user) {
        setBackendProfile(response.user);
      }

      return response;
    } catch (error) {
      console.error("❌ Failed to update backend profile:", error);
      throw error;
    } finally {
      setProfileSaving(false);
    }
  };


  // ============================================================
  // BACKEND PROFILE SYNC
  // Profile data is now stored in the authenticated backend.
  // ============================================================

  const profileBackendReadyRef = useRef(false);
  const profileSaveTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBackendProfile() {
      try {
        const data = await profileService.getFullProfile();

        if (cancelled || !data) return;

        const backendUser = data.user || {};
        const backendProfile = data.profile || {};

        if (backendUser.fullName !== undefined) {
          // Keep existing user context/UI behaviour intact.
        }

        if (backendProfile.profileImage !== undefined) {
          setProfileImage(backendProfile.profileImage || "");
        }

        if (Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
        }

        if (Array.isArray(data.paymentMethods)) {
          setSavedPaymentMethods(data.paymentMethods);
          setSavedCards(data.paymentMethods);
        }

        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }

        if (backendProfile.theme) {
          setTheme(backendProfile.theme);
        }

        if (backendProfile.language) {
          setLanguage(backendProfile.language);
        }

        profileBackendReadyRef.current = true;
      } catch (error) {
        console.error("Profile backend load failed:", error);
      }
    }

    if (user) {
      loadBackendProfile();
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!profileBackendReadyRef.current) return;

    if (profileSaveTimerRef.current) {
      clearTimeout(profileSaveTimerRef.current);
    }

    profileSaveTimerRef.current = setTimeout(async () => {
      try {
        await profileService.updateProfile({
          profileImage: profileImage || "",
          theme: theme || "light",
          language: language || "English"
        });
      } catch (error) {
        console.error("Profile settings save failed:", error);
      }
    }, 500);

    return () => {
      if (profileSaveTimerRef.current) {
        clearTimeout(profileSaveTimerRef.current);
      }
    };
  }, [profileImage, theme, language]);

  useEffect(() => {
    if (!profileBackendReadyRef.current) return;

    const timer = setTimeout(async () => {
      try {
        await profileService.updateAddresses(addresses || []);
      } catch (error) {
        console.error("Addresses save failed:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [addresses]);

  useEffect(() => {
    if (!profileBackendReadyRef.current) return;

    const timer = setTimeout(async () => {
      try {
        const methods =
          savedPaymentMethods?.length
            ? savedPaymentMethods
            : savedCards || [];

        await profileService.updatePaymentMethods(methods);
      } catch (error) {
        console.error("Payment methods save failed:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [savedPaymentMethods, savedCards]);

  useEffect(() => {
    if (!profileBackendReadyRef.current) return;

    const timer = setTimeout(async () => {
      try {
        await profileService.updateNotifications(notifications || []);
      } catch (error) {
        console.error("Notifications save failed:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className={`min-h-screen pb-28 transition-colors ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F9FAFB]'}`}>
      <div className="mx-auto max-w-md px-5 pt-6">

        {/* ==================================================
            1. MAIN PROFILE PAGE
        ================================================== */}
        {screen === "profile" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="w-10" /> 
              <h1 className="text-xl font-black text-slate-800 dark:text-white">Profile</h1>
              <button onClick={() => logout()} className="h-11 w-11 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100"><Power size={18} /></button>
            </div>

            <CardWrapper className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={profileImage || "https://ui-avatars.com/api/?name=David+Warner&background=FF7A00&color=fff"} className="h-20 w-20 rounded-full object-cover shadow-md" alt="User" />
                    <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white border-2 border-white dark:border-slate-900"><Pencil size={12} /><input type="file" hidden accept="image/*" onChange={handleImage} /></label>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">{formData.fullName}</h2>
                    <p className="text-sm font-medium text-gray-400 truncate">{formData.email}</p>
                  </div>
                </div>
                <button onClick={() => setScreen("details")} className="rounded-xl bg-orange-50 p-3 text-orange-500"><Pencil size={18} /></button>
              </div>
            </CardWrapper>

            <CardWrapper>
              <ListItem icon={Package} title="My Orders" colorClass="bg-rose-100 text-rose-500" onClick={() => navigate("/orders")} />
              <ListItem icon={Globe} title="Language" subtitle={language} colorClass="bg-amber-100 text-amber-500" onClick={() => setScreen("language")} />
              <ListItem icon={Heart} title="Favorites" colorClass="bg-orange-100 text-orange-500" onClick={() => navigate("/favourite")} />
              <ListItem icon={Settings} title="Settings" colorClass="bg-emerald-100 text-emerald-500" onClick={() => setScreen("settings_sub")} />
            </CardWrapper>

            <CardWrapper>
              <ListItem icon={CreditCard} title="Saved Cards & Accounts" colorClass="bg-sky-100 text-sky-500" onClick={() => setScreen("cards")} />
              <ListItem icon={Tag} title="Promos & Offers" colorClass="bg-pink-100 text-pink-500" onClick={() => setScreen("promos")} />
              <ListItem icon={Bell} title="Notifications" colorClass="bg-indigo-100 text-indigo-500" onClick={() => setScreen("notifications")} />
            </CardWrapper>

            <CardWrapper>
              <ListItem icon={HelpCircle} title="FAQ" colorClass="bg-blue-100 text-blue-500" onClick={() => setScreen("faq")} />
              <ListItem icon={FileText} title="Terms of use" colorClass="bg-purple-100 text-purple-500" onClick={() => setScreen("terms")} />
              <ListItem icon={ShieldAlert} title="Privacy policy" colorClass="bg-amber-100 text-amber-600" onClick={() => setScreen("privacy")} />
            </CardWrapper>
          </div>
        )}

        {/* ==================================================
            2. PROFILE DETAILS (ORIGINAL FIELDS)
        ================================================== */}
        {screen === "details" && (
           <div className="animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between mb-8">
               <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><X size={20}/></button>
               <h2 className="text-xl font-black dark:text-white">Profile Details</h2>
               <button
  onClick={async () => {
    try {
      if (!formData.fullName?.trim() || !formData.phone?.trim()) {
        showToast("Full name and phone are required", "error");
        return;
      }

      const response = await profileService.updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      if (!response?.success || !response?.user) {
        throw new Error(response?.message || "Profile update failed");
      }

      setFormData(prev => ({
        ...prev,
        fullName: response.user.fullName || prev.fullName,
        phone: response.user.phone || prev.phone,
        email: response.user.email || prev.email,
      }));

      // Keep AuthContext + persisted user data synchronized
      login(response.user);

      setScreen("profile");
      showToast("Profile Updated", "success");

    } catch (error) {
      console.error("Profile update error:", error);
      showToast(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile",
        "error"
      );
    }
  }}
  className="p-3 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-200"
>
  <Check size={20}/>
</button>
             </div>
             <CardWrapper className="p-6">
                <div className="flex flex-col items-center mb-8">
                   <div className="relative">
                      <img src={profileImage} className="h-28 w-28 rounded-full object-cover shadow-xl" alt="Profile" />
                      <label className="absolute bottom-1 right-1 h-9 w-9 bg-orange-500 text-white rounded-full flex items-center justify-center cursor-pointer border-4 border-white dark:border-slate-900"><Upload size={16} /><input type="file" hidden onChange={handleImage} /></label>
                   </div>
                   <p className="mt-4 font-bold dark:text-white">Change Photo</p>
                </div>
                <div className="space-y-4">
                  <input name="fullName" value={formData.fullName} onChange={handleProfileChange} placeholder="Full Name" className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                  <input name="email" value={formData.email} disabled className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold opacity-50" />
                  <input name="phone" value={formData.phone} onChange={handleProfileChange} placeholder="Phone" className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                  <textarea name="address" value={formData.address} onChange={handleProfileChange} placeholder="Full Address" className="w-full h-28 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                  <textarea name="about" value={formData.about} onChange={handleProfileChange} placeholder="About Yourself" className="w-full h-28 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                </div>
             </CardWrapper>
           </div>
        )}

        {/* ==================================================
            3. CARD ADD FORM (ORIGINAL GRADIENT PREVIEW)
        ================================================== */}
        {screen === "card_form" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("payment")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <div className="relative h-52 w-full rounded-[2.5rem] bg-gradient-to-br from-[#173d48] via-[#102f38] to-[#071b22] p-6 text-white shadow-xl mb-8 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border-[30px] border-white/5" />
                <div className="flex justify-between items-start mb-10">
                   <div className="h-8 w-12 bg-gradient-to-br from-[#f7e8b5] to-[#8d7d4e] rounded-md" />
                   <span className="font-black italic text-xl">{cardData.type === 'Mastercard' ? 'MC' : 'VISA'}</span>
                </div>
                <p className="text-xl tracking-[0.2em] mb-8 font-medium">{formatCardNumber(cardData.number) || '•••• •••• •••• ••••'}</p>
                <div className="flex justify-between uppercase text-[8px] opacity-40 tracking-widest"><span>Card Holder</span><span>Expires</span></div>
                <div className="flex justify-between font-bold text-xs uppercase"><span>{cardData.holder || 'YOUR NAME'}</span><span>{cardData.expiry || 'MM/YY'}</span></div>
             </div>

             <CardWrapper className="p-6 space-y-4">
                <input value={cardData.number} onChange={e=>setCardData({...cardData, number: e.target.value})} placeholder="Card Number" className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                <input value={cardData.holder} onChange={e=>setCardData({...cardData, holder: e.target.value})} placeholder="Account Holder Name" className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                <div className="flex gap-4">
                  <input value={cardData.expiry} onChange={e=>setCardData({...cardData, expiry: e.target.value})} placeholder="MM/YY" className="w-1/2 h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                  <input placeholder="CVV" type="password" className="w-1/2 h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select value={cardData.location} onChange={e=>setCardData({...cardData, location: e.target.value})} className="w-full h-14 pl-4 pr-10 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold appearance-none dark:text-white">
                       <option>Bangladesh</option><option>USA</option><option>UK</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-5 text-gray-400" size={18}/>
                  </div>
                  <input placeholder="ZIP Code" className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
                </div>
                <button onClick={saveNewCard} className="w-full h-14 bg-orange-500 text-white rounded-2xl font-black mt-4 shadow-lg shadow-orange-100">Save Card</button>
             </CardWrapper>
           </div>
        )}

        {/* ==================================================
            4. FAQ, TERMS & PRIVACY SCREENS
        ================================================== */}
        {screen === "faq" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <h2 className="text-xl font-black mb-6 dark:text-white">Frequently Asked Questions</h2>
             <div className="space-y-4">
               {['How to track order?', 'Payment methods?', 'How to refund?'].map((q, i) => (
                 <CardWrapper key={i} className="p-5"><h4 className="font-bold dark:text-white mb-2">{q}</h4><p className="text-xs text-gray-400">You can easily manage this from your profile settings and order history section.</p></CardWrapper>
               ))}
             </div>
           </div>
        )}

        {screen === "terms" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <h2 className="text-xl font-black mb-6 dark:text-white">Terms of Use</h2>
             <CardWrapper className="p-6 text-sm text-gray-500 leading-relaxed dark:text-gray-400">
               By using this app, you agree to follow our service rules. We prioritize your security and offer a seamless food delivery experience. Please ensure your account information is always accurate...
             </CardWrapper>
           </div>
        )}

        {screen === "privacy" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <h2 className="text-xl font-black mb-6 dark:text-white">Privacy Policy</h2>
             <CardWrapper className="p-6 text-sm text-gray-500 leading-relaxed dark:text-gray-400">
               Your privacy is important to us. We only collect data necessary to provide you with the best service. Your payment information is encrypted and never shared with third parties...
             </CardWrapper>
           </div>
        )}

        {/* ==================================================
            5. NOTIFICATIONS (CENTERED)
        ================================================== */}
        {screen === "notifications" && (
           <div className="animate-in slide-in-from-right duration-300">
             <div className="grid grid-cols-3 items-center mb-8">
               <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm w-fit"><X size={20}/></button>
               <h2 className="text-xl font-black dark:text-white text-center">Notifications</h2>
               <div />
             </div>
             <div className="space-y-3">
                {notifications.map(n => (
                  <button key={n.id} onClick={()=>{setNotifications(notifications.map(i=>i.id===n.id?{...i,read:true}:i))}} 
                    className={`w-full p-4 rounded-[2rem] bg-white dark:bg-slate-900 flex gap-4 text-left border ${!n.read ? 'border-orange-100 shadow-sm' : 'border-transparent opacity-60'}`}>
                    <div className="h-11 w-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><Bell size={20}/></div>
                    <div className="flex-1 min-w-0"><h4 className="text-sm font-bold dark:text-white leading-tight">{n.title}</h4><p className="text-[10px] text-gray-400 mt-1">{n.message}</p></div>
                  </button>
                ))}
                {notifications.length === 0 && <div className="text-center py-20 text-gray-300 font-bold">No Notifications</div>}
             </div>
           </div>
        )}

        {/* THEMES (ON/OFF Logic) */}
        {screen === "themes" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("settings_sub")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-8"><X size={20}/></button>
             <h2 className="text-2xl font-black dark:text-white mb-6">Select Theme</h2>
             <div className="space-y-4">
                {['light', 'dark', 'sunset', 'ocean', 'forest', 'lavender'].map(t => (
                  <button key={t} onClick={()=>setTheme(t)} className={`w-full p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-between border-2 transition-all ${theme === t ? 'border-orange-500 shadow-md' : 'border-transparent shadow-sm'}`}>
                    <span className="font-black capitalize dark:text-white">{t} Theme</span>
                    <div className={`relative h-6 w-12 rounded-full transition-colors ${theme === t ? 'bg-orange-500' : 'bg-gray-200'}`}>
                       <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${theme === t ? 'left-7' : 'left-1'}`} />
                    </div>
                  </button>
                ))}
             </div>
           </div>
        )}

        {/* OTHER SCREENS (Payment Selection, Saved Cards List, Addresses, Language, Promo) - Same working logic */}
        {screen === "settings_sub" && (
          <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-8"><X size={20}/></button>
             <CardWrapper>
                <ListItem icon={User} title="Profile Details" colorClass="bg-orange-50 text-orange-500" onClick={() => setScreen("details")} />
                <ListItem icon={Wallet} title="Payment Method" colorClass="bg-blue-50 text-blue-500" onClick={() => setScreen("payment")} />
                <ListItem icon={MapPin} title="My Address" colorClass="bg-emerald-50 text-emerald-500" onClick={() => setScreen("addresses")} />
                <ListItem icon={Sparkles} title="Themes" colorClass="bg-purple-50 text-purple-500" onClick={() => setScreen("themes")} />
             </CardWrapper>
          </div>
        )}

        {screen === "payment" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("settings_sub")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <h2 className="text-xl font-black mb-6 dark:text-white">Add Payment</h2>
             <div className="space-y-3">
               <button onClick={()=>setScreen('card_form')} className="w-full p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-between shadow-sm"><div className="flex items-center gap-4"><div className="h-11 w-11 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center"><CreditCard size={20}/></div><span className="font-black dark:text-white">Credit / Debit Card</span></div><Plus size={20} className="text-orange-500"/></button>
               {['bKash', 'Nagad', 'Rocket'].map(m => (
                 <button key={m} onClick={()=>{setMfsData({...mfsData, type:m}); setScreen('mfs_form')}} className="w-full p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-between shadow-sm"><div className="flex items-center gap-4"><div className="h-11 w-11 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center"><Smartphone size={20}/></div><span className="font-black dark:text-white">{m}</span></div><Plus size={20} className="text-orange-500"/></button>
               ))}
             </div>
           </div>
        )}

        {screen === "mfs_form" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("payment")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <CardWrapper className="p-6">
                <h3 className="font-black text-lg mb-4 dark:text-white">Add {mfsData.type}</h3>
                <input value={mfsData.number} onChange={e=>setMfsData({...mfsData, number: e.target.value})} placeholder="Account Number" className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 rounded-2xl mb-6 border-none font-bold" />
                <button onClick={()=>{setSavedPaymentMethods([{...mfsData, id:Date.now()}, ...savedPaymentMethods]); setScreen('cards'); showToast('Account Added','success')}} className="w-full h-14 bg-orange-500 text-white rounded-2xl font-black">Link Account</button>
             </CardWrapper>
           </div>
        )}

        {screen === "cards" && (
           <div className="animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between mb-8">
               <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><X size={20}/></button>
               <h2 className="text-xl font-black dark:text-white">Cards & Accounts</h2>
               <button onClick={() => setScreen("payment")} className="p-3 bg-orange-500 text-white rounded-2xl"><Plus size={20}/></button>
             </div>
             <div className="space-y-4">
                {savedCards.map(card => (
                  <div key={card.id} className="relative h-48 w-full rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-white shadow-xl">
                    <div className="flex justify-between items-start"><div className="w-10 h-6 bg-amber-200/20 rounded" /><span className="font-bold italic">{card.type}</span></div>
                    <p className="text-lg tracking-[0.2em] my-6 font-medium">•••• •••• •••• {card.number}</p>
                    <div className="flex justify-between items-end"><div><p className="text-[10px] opacity-40 uppercase">Holder</p><p className="text-xs font-bold uppercase">{card.holder}</p></div><button onClick={()=>setSavedCards(savedCards.filter(c=>c.id!==card.id))} className="p-2 bg-red-500/20 rounded-xl"><Trash2 size={16}/></button></div>
                  </div>
                ))}
                {savedPaymentMethods.map(acc => (
                  <CardWrapper key={acc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4"><div className="h-11 w-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><Smartphone size={20}/></div><div><p className="font-black dark:text-white">{acc.type}</p><p className="text-xs text-gray-400 font-bold">{acc.number}</p></div></div>
                    <button onClick={()=>setSavedPaymentMethods(savedPaymentMethods.filter(a=>a.id!==acc.id))} className="text-red-500 p-2"><Trash2 size={18}/></button>
                  </CardWrapper>
                ))}
             </div>
           </div>
        )}

        {screen === "addresses" && (
           <div className="animate-in slide-in-from-right duration-300">
             <div className="flex items-center justify-between mb-8">
               <button onClick={() => setScreen("settings_sub")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><X size={20}/></button>
               <h2 className="text-xl font-black dark:text-white">My Address</h2>
               <button onClick={() => setScreen("address_form")} className="p-3 bg-orange-500 text-white rounded-2xl"><Plus size={20}/></button>
             </div>
             <div className="space-y-4">
                {addresses.map(addr => (
                  <CardWrapper key={addr.id} className="p-5 flex items-start gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">{addr.label === 'Home' ? <Home size={18}/> : addr.label === 'Work' ? <Briefcase size={18}/> : <MapPin size={18}/>}</div>
                    <div className="flex-1"><h4 className="font-black dark:text-white">{addr.label}</h4><p className="text-sm text-gray-400 mt-1 leading-snug">{addr.address}</p></div>
                    <button onClick={()=>setAddresses(addresses.filter(a=>a.id!==addr.id))} className="text-red-400 p-2"><Trash2 size={18}/></button>
                  </CardWrapper>
                ))}
             </div>
           </div>
        )}

        {screen === "address_form" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("addresses")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><X size={20}/></button>
             <CardWrapper className="p-6">
                <div className="flex gap-2 mb-6">{['Home', 'Work', 'Other'].map(l => (<button key={l} onClick={()=>setAddressData({...addressData, label:l})} className={`flex-1 py-3 rounded-2xl font-black text-xs ${addressData.label === l ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}>{l}</button>))}</div>
                <textarea value={addressData.address} onChange={e=>setAddressData({...addressData, address: e.target.value})} placeholder="Flat, Road, Area..." className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none mb-6 font-bold dark:text-white" />
                <button onClick={()=>{setAddresses([{...addressData, id:Date.now()}, ...addresses]); setScreen('addresses'); showToast('Saved','success')}} className="w-full h-14 bg-orange-500 text-white rounded-2xl font-black">Save Address</button>
             </CardWrapper>
           </div>
        )}

        {screen === "promos" && (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-8"><X size={20}/></button>
            <div className="flex gap-3 mb-8">
               <input placeholder="PROMO CODE" className="flex-1 h-14 px-5 bg-white dark:bg-slate-900 rounded-2xl font-black border-none shadow-sm min-w-0" />
               <button onClick={()=>showToast('Applied','success')} className="h-14 px-6 bg-orange-500 text-white rounded-2xl font-black shadow-lg">Apply</button>
            </div>
            {[{c:'WELCOME20', d:'20% OFF'}, {c:'FOOD50', d:'৳50 OFF'}].map(p => (
              <CardWrapper key={p.c} className="p-5 flex justify-between items-center"><div><h3 className="font-black dark:text-white">{p.c}</h3><p className="text-[10px] text-gray-400">Limited offer</p></div><span className="bg-orange-50 text-orange-500 px-3 py-1 rounded-xl font-black text-[10px]">{p.d}</span></CardWrapper>
            ))}
          </div>
        )}

        {screen === "language" && (
           <div className="animate-in slide-in-from-right duration-300">
             <button onClick={() => setScreen("profile")} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-6"><ArrowLeft size={20}/></button>
             <h2 className="text-2xl font-black dark:text-white mb-6">Language</h2>
             <div className="grid grid-cols-1 gap-3">
               {[{n:'English', f:'🇬🇧'}, {n:'Bengali', f:'🇧🇩'}, {n:'Spanish', f:'🇪🇸'}, {n:'French', f:'🇫🇷'}, {n:'Arabic', f:'🇸🇦'}].map(l => (
                 <button key={l.n} onClick={()=>{setLanguage(l.n); setScreen('profile'); showToast(`Language: ${l.n}`, 'success')}} className={`flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl ${language===l.n?'ring-2 ring-orange-500':'shadow-sm'}`}><div className="flex items-center gap-4 text-lg font-bold dark:text-white"><span>{l.f}</span><span>{l.n}</span></div>{language===l.n && <Check size={20} className="text-orange-500" />}</button>
               ))}
             </div>
           </div>
        )}

      </div>
    </div>
  );
}
