import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function LocationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveLocation = (location) => {
    const cleanLocation = location.trim();

    if (!cleanLocation) {
      setError("Please enter your location.");
      return;
    }

    /* =====================================================
       SAVE LOCATION
    ===================================================== */
    localStorage.setItem("userLocation", cleanLocation);

    /* =====================================================
       SAVE ADDRESS
    ===================================================== */
    let existingAddresses = [];

    try {
      existingAddresses = JSON.parse(
        localStorage.getItem("savedAddresses") || "[]"
      );

      if (!Array.isArray(existingAddresses)) {
        existingAddresses = [];
      }
    } catch {
      existingAddresses = [];
    }

    const alreadyExists = existingAddresses.some(
      (item) =>
        item?.address?.toLowerCase() ===
        cleanLocation.toLowerCase()
    );

    if (!alreadyExists) {
      const newAddress = {
        id: Date.now(),
        label: "Home",
        address: cleanLocation,
        city: "",
        phone: user?.phone || "",
        isDefault: true,
      };

      const updatedAddresses = [
        newAddress,
        ...existingAddresses.map((item) => ({
          ...item,
          isDefault: false,
        })),
      ];

      localStorage.setItem(
        "savedAddresses",
        JSON.stringify(updatedAddresses)
      );
    }

    /* =====================================================
       SETUP COMPLETED
    ===================================================== */

    localStorage.setItem(
      "setupCompleted",
      "true"
    );

    localStorage.setItem(
      "locationSetupCompleted",
      "true"
    );

    /*
     * IMPORTANT:
     * LoginPage checks this USER-SPECIFIC key.
     * The old LocationPage was not saving it.
     * That caused:
     *
     * Location -> Home -> Language -> Location
     *
     * on the next login/startup flow.
     */
    const userKey =
      user?.id ||
      user?.email;

    if (userKey) {
      localStorage.setItem(
        `initialSetupCompleted_${userKey}`,
        "true"
      );
    }

    /* =====================================================
       APP EVENTS
    ===================================================== */
    window.dispatchEvent(
      new Event("locationChanged")
    );

    window.dispatchEvent(
      new Event("profileUpdated")
    );

    /*
     * IMPORTANT:
     * Location Continue ALWAYS goes directly to Home.
     */
    navigate("/home", {
      replace: true,
    });
  };

  const handleDeviceLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError(
        "Device location is not supported."
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
        } = position.coords;

        const location =
          `Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        setLoading(false);

        saveLocation(location);
      },
      () => {
        setLoading(false);

        setError(
          "Location permission denied. Please enable location or enter manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualLocation = () => {
    const value = manualLocation.trim();

    if (!value) {
      setError(
        "Please enter your location."
      );
      return;
    }

    setLoading(false);
    saveLocation(value);
  };

  return (
    <div className="min-h-screen w-full bg-[#fff8f1] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-5 sm:px-7">

        {/* HEADER */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft
              size={21}
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* TITLE */}
        <div className="mt-5 text-center">
          <h1 className="mx-auto max-w-[430px] text-[29px] font-semibold leading-[1.18] tracking-[-0.8px] sm:text-[32px]">
            Set your location to start
            <br />
            exploring
            <br />
            restaurants near you
          </h1>
        </div>

        {/* ILLUSTRATION */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden py-7">

          <div className="absolute h-[330px] w-[330px] rounded-full bg-[#fff0e2] sm:h-[390px] sm:w-[390px]" />

          <div className="relative h-[390px] w-full max-w-[420px] sm:h-[440px]">

            {/* ROADS */}
            <div className="absolute left-[9%] top-[43%] h-[24px] w-[82%] rotate-[24deg] rounded-full bg-[#f8e6d5]" />

            <div className="absolute left-[19%] top-[48%] h-[20px] w-[68%] rotate-[-20deg] rounded-full bg-[#f4dfcc]" />

            <div className="absolute left-[47%] top-[10%] h-[80%] w-[18px] rotate-[16deg] rounded-full bg-[#f8e8d9]" />

            {/* BUILDINGS */}
            <div className="absolute left-[15%] top-[27%] h-16 w-12 rounded-t-xl bg-[#ead8c7] shadow-sm" />

            <div className="absolute left-[27%] top-[18%] h-24 w-14 rounded-t-xl bg-[#e6d1be] shadow-sm" />

            <div className="absolute right-[16%] top-[25%] h-20 w-14 rounded-t-xl bg-[#ead9c8] shadow-sm" />

            <div className="absolute right-[29%] top-[38%] h-14 w-11 rounded-t-xl bg-[#e4ccb7] shadow-sm" />

            {/* WINDOWS */}
            <div className="absolute left-[19%] top-[34%] grid grid-cols-2 gap-1">
              <i className="h-2 w-2 rounded-sm bg-[#d4bca7]" />
              <i className="h-2 w-2 rounded-sm bg-[#d4bca7]" />
              <i className="h-2 w-2 rounded-sm bg-[#d4bca7]" />
              <i className="h-2 w-2 rounded-sm bg-[#d4bca7]" />
            </div>

            <div className="absolute left-[31%] top-[25%] grid grid-cols-2 gap-1">
              <i className="h-2 w-2 rounded-sm bg-[#d1b7a1]" />
              <i className="h-2 w-2 rounded-sm bg-[#d1b7a1]" />
              <i className="h-2 w-2 rounded-sm bg-[#d1b7a1]" />
              <i className="h-2 w-2 rounded-sm bg-[#d1b7a1]" />
            </div>

            {/* FOOD PLACES */}
            <div className="absolute bottom-[17%] left-[16%] flex h-16 w-20 items-center justify-center rounded-xl border border-[#ead5c1] bg-white text-3xl shadow-md">
              🍔
            </div>

            <div className="absolute right-[13%] top-[39%] flex h-14 w-16 items-center justify-center rounded-xl border border-[#ead5c1] bg-white text-2xl shadow-md">
              🍕
            </div>

            <div className="absolute bottom-[8%] left-1/2 flex h-16 w-20 -translate-x-1/2 items-center justify-center rounded-xl border border-[#ead5c1] bg-white text-3xl shadow-md">
              🍜
            </div>

            {/* LOCATION PIN */}
            <div className="absolute left-1/2 top-[42%] -translate-x-1/2">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe4cf]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f29a52] shadow-[0_12px_28px_rgba(242,154,82,0.28)]">
                  <MapPin
                    size={38}
                    strokeWidth={2.5}
                    className="text-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mb-3 px-2 text-center text-sm font-semibold text-red-500">
            {error}
          </p>
        )}

        {/* DEVICE LOCATION */}
        <button
          type="button"
          onClick={handleDeviceLocation}
          disabled={loading}
          className="flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[#f29a52] px-5 text-[16px] font-bold text-white shadow-[0_10px_25px_rgba(242,154,82,0.20)] transition active:scale-[0.98] disabled:opacity-60 sm:text-lg"
        >
          <Navigation size={21} />

          {loading
            ? "Getting Your Location..."
            : "Enable Device Location"}
        </button>

        {/* MANUAL LOCATION */}
        <div className="mt-4 flex min-h-[58px] items-center rounded-2xl border-2 border-[#f2a56a] bg-white px-4">

          <Search
            size={20}
            className="shrink-0 text-[#df8138]"
          />

          <input
            type="text"
            value={manualLocation}
            onChange={(e) => {
              setManualLocation(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualLocation();
              }
            }}
            placeholder="Enter Your Location Manually"
            className="ml-3 min-w-0 flex-1 bg-transparent text-center text-[15px] font-semibold text-[#c96f2b] outline-none placeholder:text-[#d98a4b] sm:text-base"
          />

          <button
            type="button"
            onClick={handleManualLocation}
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0e2] text-[#e5863d] transition active:scale-95"
            aria-label="Save location"
          >
            <MapPin size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}
