import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  MoreVertical,
  MessageCircle,
  Phone,
  Truck,
  Navigation,
  MapPin,
  Clock3,
  CheckCircle2,
} from "lucide-react";

/* =========================
   LOCATION DATA
========================= */

const START_RIDER = [23.8103, 90.4125];
const CUSTOMER_LOCATION = [23.7949, 90.4043];

/* Road-like route between rider and customer */
const ROUTE_POINTS = [
  [23.8103, 90.4125],
  [23.8089, 90.4118],
  [23.8075, 90.4107],
  [23.8064, 90.4092],
  [23.8048, 90.4088],
  [23.8032, 90.4075],
  [23.8016, 90.4071],
  [23.7999, 90.4061],
  [23.7982, 90.4055],
  [23.7965, 90.4049],
  [23.7949, 90.4043],
];

/* =========================
   MAP ICONS
========================= */

const riderIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:linear-gradient(135deg,#fb923c,#f97316);
      border:4px solid white;
      box-shadow:0 5px 18px rgba(249,115,22,.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:19px;
    ">
      🚴
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const customerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:white;
      border:4px solid #f97316;
      box-shadow:0 5px 18px rgba(249,115,22,.25);
      display:flex;
      align-items:center;
      justify-content:center;
      color:#f97316;
      font-size:20px;
    ">
      ●
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

/* =========================
   MAP FIT
========================= */

function RouteView({ riderPos, customerPos }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([riderPos, customerPos]);

    map.fitBounds(bounds, {
      padding: [55, 55],
      maxZoom: 15,
      animate: true,
    });
  }, [map, riderPos, customerPos]);

  return null;
}

/* =========================
   MAIN PAGE
========================= */

const Map = () => {
  const [routeIndex, setRouteIndex] = useState(0);

  const riderPos = ROUTE_POINTS[routeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        if (prev >= ROUTE_POINTS.length - 1) {
          return prev;
        }

        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const remainingRoute = useMemo(() => {
    return ROUTE_POINTS.slice(routeIndex);
  }, [routeIndex]);

  const progress = Math.round(
    (routeIndex / (ROUTE_POINTS.length - 1)) * 100
  );

  const remainingMinutes = Math.max(
    3,
    Math.round(20 - (progress * 17) / 100)
  );

  const distance = Math.max(
    0.3,
    Number((2.4 - (progress * 2.1) / 100).toFixed(1))
  );

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans">

      <div className="mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-[#F4F4F4]">

        {/* ================= MAP ================= */}

        <div className="relative h-[44vh] min-h-[340px] w-full shrink-0">

          <MapContainer
            center={CUSTOMER_LOCATION}
            zoom={14}
            zoomControl={false}
            attributionControl={false}
            style={{
              height: "100%",
              width: "100%",
            }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <RouteView
              riderPos={riderPos}
              customerPos={CUSTOMER_LOCATION}
            />

            {/* Soft route shadow */}
            <Polyline
              positions={remainingRoute}
              color="#ffffff"
              weight={9}
              opacity={0.9}
              lineCap="round"
              lineJoin="round"
            />

            {/* Main orange route */}
            <Polyline
              positions={remainingRoute}
              color="#f97316"
              weight={5}
              opacity={0.95}
              lineCap="round"
              lineJoin="round"
            />

            {/* Completed route */}
            {routeIndex > 0 && (
              <Polyline
                positions={ROUTE_POINTS.slice(0, routeIndex + 1)}
                color="#d1d5db"
                weight={4}
                opacity={0.75}
                lineCap="round"
              />
            )}

            {/* Rider */}
            <Marker position={riderPos} icon={riderIcon}>
              <Popup>
                <strong>David Warner</strong>
                <br />
                Rider is on the way
              </Popup>
            </Marker>

            {/* Customer */}
            <Marker
              position={CUSTOMER_LOCATION}
              icon={customerIcon}
            >
              <Popup>
                <strong>Your Location</strong>
                <br />
                Delivery destination
              </Popup>
            </Marker>

            {/* Customer location accuracy ring */}
            <CircleMarker
              center={CUSTOMER_LOCATION}
              radius={24}
              pathOptions={{
                color: "#f97316",
                fillColor: "#fb923c",
                fillOpacity: 0.08,
                weight: 1.5,
              }}
            />

          </MapContainer>

          {/* ================= MAP HEADER ================= */}

          <div className="absolute left-0 right-0 top-0 z-[1000] flex items-center justify-between p-4">

            <button
              onClick={() => window.history.back()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/90 shadow-lg backdrop-blur-md active:scale-95"
            >
              <ChevronLeft
                size={21}
                className="text-slate-700"
              />
            </button>

            <div className="rounded-full border border-white/70 bg-white/90 px-5 py-2.5 shadow-lg backdrop-blur-md">
              <p className="text-sm font-black text-slate-800">
                Live Tracking
              </p>
            </div>

            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/90 shadow-lg backdrop-blur-md"
            >
              <MoreVertical
                size={20}
                className="text-slate-700"
              />
            </button>

          </div>

          {/* ETA floating badge */}

          <div className="absolute bottom-4 left-4 right-4 z-[1000]">

            <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Arriving in
                  </p>

                  <p className="text-sm font-black text-slate-800">
                    {remainingMinutes} minutes
                  </p>
                </div>

              </div>

              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Distance
                </p>

                <p className="text-sm font-black text-orange-500">
                  {distance} km
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ================= BOTTOM CONTENT ================= */}

        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-32 pt-5">

          {/* RIDER CARD */}

          <div className="rounded-[30px] border border-gray-100 bg-white p-4 shadow-xl">

            <div className="flex items-center justify-between">

              <div className="flex min-w-0 items-center gap-3">

                <div className="relative">

                  <img
                    src="https://i.pravatar.cc/150?u=david"
                    className="h-14 w-14 rounded-full border-2 border-orange-400 object-cover"
                    alt="David Warner"
                  />

                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-orange-500" />

                </div>

                <div className="min-w-0">

                  <h4 className="truncate text-sm font-black text-slate-800">
                    David Warner
                  </h4>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Delivery Rider • ID: 12345678
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span className="text-[9px] font-bold text-orange-500">
                      On the way
                    </span>
                  </div>

                </div>

              </div>

              <div className="flex gap-2">

                <a
                  href="sms:+880123456789"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-all active:scale-95"
                >
                  <MessageCircle size={19} />
                </a>

                <a
                  href="tel:+880123456789"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                  <Phone size={18} />
                </a>

              </div>

            </div>

          </div>

          {/* DELIVERY STATUS */}

          <div className="rounded-[35px] border border-gray-50 bg-white p-6 shadow-xl">

            <div className="mb-7 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Truck size={21} />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Estimated Delivery
                  </p>

                  <p className="mt-0.5 text-sm font-black text-slate-800">
                    {remainingMinutes} - {remainingMinutes + 5} Minutes
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-orange-50 px-3 py-1.5">
                <span className="text-[9px] font-black text-orange-500">
                  {progress}% COMPLETE
                </span>
              </div>

            </div>

            <div className="space-y-1">

              <StatusItem
                title="Order Confirmed"
                time="10:30 PM"
                active
                completed
              />

              <StatusItem
                title="Preparing Food"
                time="10:45 PM"
                active
                completed
              />

              <StatusItem
                title="Food on the Way"
                time="11:50 PM"
                active
                pulse
              />

              <StatusItem
                title="Delivered to you"
                time="12:30 PM"
                last
              />

            </div>

            {/* DELIVERY DESTINATION */}

            <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200">
                  <MapPin size={18} />
                </div>

                <div className="min-w-0">

                  <p className="text-[9px] font-black uppercase tracking-wider text-orange-500">
                    Delivery Destination
                  </p>

                  <p className="mt-1 text-xs font-bold leading-5 text-slate-700">
                    Your saved delivery location
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Rider is following the delivery route
                  </p>

                </div>

              </div>

            </div>

            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 py-4 text-base font-black text-white shadow-xl shadow-orange-200 transition-all active:scale-[0.98]"
            >
              <Navigation size={18} />
              Track Rider
            </button>

          </div>

          {/* LIVE STATUS */}

          <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-md">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <CheckCircle2 size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-slate-800">
                  Rider is moving toward you
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Location updates automatically every few seconds
                </p>

              </div>

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

/* =========================
   STATUS ITEM
========================= */

const StatusItem = ({
  title,
  time,
  active = false,
  completed = false,
  last = false,
  pulse = false,
}) => (
  <div className="flex gap-4">

    <div className="flex flex-col items-center">

      <div
        className={`relative flex h-4 w-4 items-center justify-center rounded-full ${
          active
            ? "bg-orange-500"
            : "bg-gray-200"
        }`}
      >

        {pulse && (
          <span className="absolute h-5 w-5 animate-ping rounded-full bg-orange-300 opacity-60" />
        )}

        {completed && (
          <CheckCircle2
            size={11}
            className="relative text-white"
          />
        )}

      </div>

      {!last && (
        <div
          className={`mt-1 h-8 w-0.5 ${
            active
              ? "bg-orange-200"
              : "bg-gray-100"
          }`}
        />
      )}

    </div>

    <div className="flex flex-1 items-start justify-between pb-1">

      <p
        className={`text-xs font-bold ${
          active
            ? "text-slate-800"
            : "text-gray-300"
        }`}
      >
        {title}
      </p>

      <span className="text-[10px] font-bold text-gray-400">
        {time}
      </span>

    </div>

  </div>
);

export default Map;
