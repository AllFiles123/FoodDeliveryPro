import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  MapPin,
  Clock3,
  CheckCircle2,
  Navigation,
  ChevronUp,
  ChevronDown,
  Star,
  ShieldCheck,
} from "lucide-react";

/* =========================
   LOCATION DATA
========================= */

const START_RIDER = [23.8103, 90.4125];
const CUSTOMER_LOCATION = [23.7949, 90.4043];

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
      width:46px;
      height:46px;
      border-radius:50%;
      background:linear-gradient(135deg,#fb923c,#f97316);
      border:4px solid white;
      box-shadow:0 6px 22px rgba(249,115,22,.40);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:20px;
    ">
      🚴
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const customerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:44px;
      height:44px;
      border-radius:50%;
      background:white;
      border:4px solid #f97316;
      box-shadow:0 6px 22px rgba(249,115,22,.28);
      display:flex;
      align-items:center;
      justify-content:center;
      color:#f97316;
      font-size:20px;
      font-weight:900;
    ">
      ●
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

/* =========================
   MAP FIT
========================= */

function RouteView({ riderPos, customerPos }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([riderPos, customerPos]);

    map.fitBounds(bounds, {
      padding: [80, 80],
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
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const riderPos = ROUTE_POINTS[routeIndex];

  /* =========================
     RIDER MOVEMENT
  ========================= */

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

  /* =========================
     DELIVERY CALCULATIONS
  ========================= */

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

  /* =========================
     SHEET SNAP
  ========================= */

  const handleSheetDragEnd = (_, info) => {
    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;

    if (offsetY < -80 || velocityY < -500) {
      setSheetExpanded(true);
      return;
    }

    if (offsetY > 80 || velocityY > 500) {
      setSheetExpanded(false);
      return;
    }

    if (sheetExpanded && offsetY > 20) {
      setSheetExpanded(false);
    } else if (!sheetExpanded && offsetY < -20) {
      setSheetExpanded(true);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans">

      <div className="relative mx-auto h-[100dvh] w-full max-w-md overflow-hidden bg-[#f4f4f4]">

        {/* =====================================================
            FULL SCREEN MAP
        ===================================================== */}

        <div className="absolute inset-0 z-0">

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

            {/* Route shadow */}

            <Polyline
              positions={remainingRoute}
              color="#ffffff"
              weight={10}
              opacity={0.9}
              lineCap="round"
              lineJoin="round"
            />

            {/* Active route */}

            <Polyline
              positions={remainingRoute}
              color="#f97316"
              weight={5}
              opacity={0.96}
              lineCap="round"
              lineJoin="round"
            />

            {/* Completed route */}

            {routeIndex > 0 && (
              <Polyline
                positions={ROUTE_POINTS.slice(0, routeIndex + 1)}
                color="#cbd5e1"
                weight={4}
                opacity={0.8}
                lineCap="round"
              />
            )}

            {/* Rider */}

            <Marker
              position={riderPos}
              icon={riderIcon}
            >
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

            {/* Customer accuracy ring */}

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

        </div>

        {/* =====================================================
            TOP MAP HEADER
        ===================================================== */}

        <div className="absolute left-0 right-0 top-0 z-[1000]">

          <div className="flex items-center justify-between px-4 pt-4">

            {/* Back */}

            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/95 text-slate-700 shadow-lg backdrop-blur-xl transition active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Title */}

            <div className="rounded-full border border-white/70 bg-white/95 px-5 py-2.5 shadow-lg backdrop-blur-xl">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />

                <p className="text-[13px] font-black text-slate-800">
                  Live Tracking
                </p>

              </div>

            </div>

            {/* More */}

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/95 text-slate-700 shadow-lg backdrop-blur-xl transition active:scale-95"
            >
              <MoreVertical size={20} />
            </button>

          </div>

        </div>

        {/* =====================================================
            DRAGGABLE BOTTOM SHEET
        ===================================================== */}

        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[1100] max-h-[82dvh] min-h-[190px] overflow-hidden rounded-t-[34px] border-t border-white/80 bg-white shadow-[0_-12px_45px_rgba(15,23,42,0.18)]"
          initial={{
            y: "calc(100% - 190px)",
          }}
          animate={{
            y: sheetExpanded
              ? 0
              : "calc(100% - 190px)",
          }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 34,
            mass: 0.8,
          }}
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          dragElastic={0.08}
          onDragEnd={handleSheetDragEnd}
        >

          {/* ===================================================
              DRAG HANDLE
          =================================================== */}

          <div
            className="flex h-[58px] cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            onClick={() => setSheetExpanded((prev) => !prev)}
          >

            <div className="h-1.5 w-12 rounded-full bg-slate-300" />

          </div>

          {/* ===================================================
              COLLAPSED PREVIEW
          =================================================== */}

          <div className="px-5 pb-5">

            <div className="flex items-center justify-between">

              <div className="flex min-w-0 items-center gap-3">

                <div className="relative shrink-0">

                  <img
                    src="https://i.pravatar.cc/150?u=david"
                    className="h-12 w-12 rounded-full border-2 border-orange-400 object-cover"
                    alt="David Warner"
                  />

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-orange-500" />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h3 className="truncate text-sm font-black text-slate-800">
                      David Warner
                    </h3>

                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[8px] font-black text-orange-500">
                      RIDER
                    </span>

                  </div>

                  <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                    Your rider is on the way
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <a
                  href="sms:+880123456789"
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition active:scale-95"
                  aria-label="Message rider"
                >
                  <MessageCircle size={18} />
                </a>

                <a
                  href="tel:+880123456789"
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200 transition active:scale-95"
                  aria-label="Call rider"
                >
                  <Phone size={17} />
                </a>

              </div>

            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-orange-50/70 px-4 py-3">

              <div className="flex items-center gap-2">

                <Clock3
                  size={16}
                  className="text-orange-500"
                />

                <span className="text-xs font-black text-slate-700">
                  {remainingMinutes} min away
                </span>

              </div>

              <div className="flex items-center gap-1">

                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                <span className="text-[9px] font-black uppercase tracking-wider text-orange-500">
                  Live
                </span>

              </div>

            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400">

              {sheetExpanded ? (
                <>
                  <ChevronDown size={15} />
                  <span className="text-[9px] font-bold">
                    Swipe down to see map
                  </span>
                </>
              ) : (
                <>
                  <ChevronUp size={15} />
                  <span className="text-[9px] font-bold">
                    Swipe up for delivery details
                  </span>
                </>
              )}

            </div>

          </div>

          {/* ===================================================
              EXPANDED CONTENT
          =================================================== */}

          <div
            className="map-sheet-scroll max-h-[calc(82dvh-58px)] overflow-y-auto overscroll-contain px-5 pb-8"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#f97316 #f1f5f9",
            }}
          >

            {/* Rider profile */}

            <div className="mb-4 rounded-[26px] border border-gray-100 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <img
                      src="https://i.pravatar.cc/150?u=david"
                      className="h-14 w-14 rounded-full border-2 border-orange-400 object-cover"
                      alt="David Warner"
                    />

                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-orange-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>

                  </div>

                  <div>

                    <h4 className="text-sm font-black text-slate-800">
                      David Warner
                    </h4>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Delivery Rider • ID: 12345678
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">

                      <Star
                        size={11}
                        fill="currentColor"
                        className="text-orange-400"
                      />

                      <span className="text-[10px] font-black text-slate-600">
                        4.9
                      </span>

                      <span className="text-[9px] text-gray-400">
                        • Excellent rider
                      </span>

                    </div>

                  </div>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <ShieldCheck size={18} />
                </div>

              </div>

            </div>

            {/* Delivery progress */}

            <div className="mb-4 rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Truck size={19} />
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
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

              {/* Progress bar */}

              <div className="mb-6">

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">

                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                    animate={{
                      width: `${Math.max(progress, 5)}%`,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  />

                </div>

              </div>

              {/* Status timeline */}

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

            </div>

            {/* Destination */}

            <div className="mb-4 rounded-[26px] border border-orange-100 bg-orange-50/60 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200">
                  <MapPin size={18} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between">

                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-orange-500">
                      Delivery Destination
                    </p>

                    <Navigation
                      size={15}
                      className="text-orange-400"
                    />

                  </div>

                  <p className="mt-1 text-xs font-black leading-5 text-slate-700">
                    Your saved delivery location
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-400">
                    Rider is following the live delivery route to your location.
                  </p>

                </div>

              </div>

            </div>

            {/* Live status */}

            <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <CheckCircle2 size={19} />
                </div>

                <div className="flex-1">

                  <p className="text-xs font-black text-slate-800">
                    Rider is moving toward you
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
                    Location updates automatically every few seconds.
                  </p>

                </div>

                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />

              </div>

            </div>

          </div>

        </motion.div>

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
        className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
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
