import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, ArrowRight } from "lucide-react";

export default function LocationPage() {
  const navigate = useNavigate();

  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goHome = (location) => {
    localStorage.setItem("userLocation", location);
    window.dispatchEvent(new Event("locationChanged"));
    navigate("/home", { replace: true });
  };

  const handleDeviceLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Device location is not supported.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const location = `Location: ${latitude.toFixed(
          5
        )}, ${longitude.toFixed(5)}`;

        goHome(location);
      },
      () => {
        setError(
          "Location permission denied. Please enable location or enter manually."
        );
        setLoading(false);
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
      setError("Please enter your location.");
      return;
    }

    goHome(value);
  };

  return (
    <div className="min-h-screen bg-white px-5 py-8">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col">

        <div className="pt-6 text-center">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            Set your location to start
            <br />
            exploring
            <br />
            restaurants near you
          </h1>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-8">

          <div className="absolute inset-x-8 top-20 bottom-12 rounded-[45%] bg-green-50" />

          <div className="relative text-center">

            <div className="mb-6 text-[110px] leading-none">
              🏙️
            </div>

            <div className="absolute left-1/2 top-20 -translate-x-1/2">
              <MapPin
                size={90}
                strokeWidth={2.5}
                className="fill-green-500 text-green-700 drop-shadow-xl"
              />
            </div>

            <div className="mt-8 flex justify-center gap-8 text-5xl">
              🍔 🍕
            </div>

            <div className="mt-8 text-6xl">
              🏪
            </div>

          </div>
        </div>

        <div className="space-y-4 pb-5">

          <button
            onClick={handleDeviceLocation}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 py-5 text-lg font-bold text-white shadow-lg shadow-green-200 transition active:scale-[0.98] disabled:opacity-60"
          >
            <Navigation size={22} />

            {loading
              ? "Getting Your Location..."
              : "Enable Device Location"}
          </button>

          <div className="rounded-2xl border-2 border-green-600 bg-white p-1">
            <div className="flex items-center gap-2 px-3">
              <MapPin
                size={20}
                className="shrink-0 text-green-600"
              />

              <input
                value={manualLocation}
                onChange={(e) => {
                  setManualLocation(e.target.value);
                  setError("");
                }}
                placeholder="Enter Your Location Manually"
                className="w-full bg-transparent px-2 py-4 text-center text-lg font-semibold text-green-700 outline-none placeholder:text-green-600"
              />

              <button
                onClick={handleManualLocation}
                className="rounded-xl bg-green-600 p-2 text-white"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-center text-sm font-semibold text-red-500">
              {error}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
