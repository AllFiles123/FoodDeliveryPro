import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  MapPin,
  Star,
  Heart,
} from "lucide-react";

import restaurantService from "../../services/restaurantService";
import { useFavourite } from "../../context/FavouriteContext";

export default function RestaurantListPage() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("top");

  const {
    isRestaurantFavourite,
    toggleRestaurantFavourite,
  } = useFavourite();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response =
          await restaurantService.getRestaurants();

        console.log(
          "Restaurant API Response:",
          response
        );

        setRestaurants(
          response?.restaurants || []
        );
      } catch (error) {
        console.error(
          "Failed to load restaurants:",
          error
        );

        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const handleFavourite = (restaurant, event) => {
    event.stopPropagation();

    toggleRestaurantFavourite(restaurant);
  };

  const getRating = (restaurant) => {
    const rating = Number(restaurant?.rating);

    return Number.isFinite(rating)
      ? rating
      : 4.5;
  };

  const getDeliveryMinutes = (restaurant) => {
    const value = String(
      restaurant?.deliveryTime || ""
    );

    const match = value.match(/\d+/);

    return match
      ? Number(match[0])
      : 30;
  };

  const sortedRestaurants = useMemo(() => {
    const list = [...restaurants];

    if (activeTab === "top") {
      return list.sort(
        (a, b) =>
          getRating(b) - getRating(a)
      );
    }

    if (activeTab === "nearest") {
      return list.sort((a, b) => {
        const distanceA =
          Number(
            a?.distance ??
              a?.distanceKm ??
              a?.distanceInKm
          );

        const distanceB =
          Number(
            b?.distance ??
              b?.distanceKm ??
              b?.distanceInKm
          );

        if (
          Number.isFinite(distanceA) &&
          Number.isFinite(distanceB)
        ) {
          return distanceA - distanceB;
        }

        return 0;
      });
    }

    if (activeTab === "free") {
      return list.sort((a, b) => {
        const freeA =
          a?.freeDelivery === true ||
          a?.isFreeDelivery === true;

        const freeB =
          b?.freeDelivery === true ||
          b?.isFreeDelivery === true;

        if (freeA !== freeB) {
          return freeA ? -1 : 1;
        }

        return (
          getDeliveryMinutes(a) -
          getDeliveryMinutes(b)
        );
      });
    }

    return list;
  }, [restaurants, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4">
        <div className="mx-auto max-w-md">

          {/* HEADER SKELETON */}

          <div className="flex items-center gap-3 pt-5">

            <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200" />

            <div className="space-y-2">
              <div className="h-5 w-36 animate-pulse rounded-full bg-gray-200" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>

          </div>

          {/* TABS SKELETON */}

          <div className="mt-6 flex gap-2">
            <div className="h-11 flex-1 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-11 flex-1 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-11 flex-1 animate-pulse rounded-2xl bg-gray-200" />
          </div>

          {/* CARD SKELETON */}

          <div className="mt-5 space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[28px] bg-white shadow-sm"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-28 font-sans">

      <div className="mx-auto max-w-md">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center gap-3 pt-4">

          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-gray-800
              shadow-sm
              ring-1
              ring-gray-100
              transition
              active:scale-90
            "
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>

          {/* TITLE */}

          <div className="min-w-0">

            <h1 className="truncate text-[23px] font-extrabold leading-tight text-gray-900">
              All Restaurants
            </h1>

            <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
              {restaurants.length} restaurants near you
            </p>

          </div>

        </div>

        {/* =====================================================
            FILTER / SORT TABS
        ====================================================== */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

          <button
            type="button"
            onClick={() => setActiveTab("top")}
            className={`
              shrink-0
              rounded-2xl
              px-5
              py-3
              text-xs
              font-extrabold
              transition-all
              active:scale-95
              ${
                activeTab === "top"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-500 shadow-sm ring-1 ring-gray-100"
              }
            `}
          >
            <span className="flex items-center gap-1.5">
              <Star
                size={14}
                fill={
                  activeTab === "top"
                    ? "currentColor"
                    : "none"
                }
              />
              Top Rated
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("nearest")}
            className={`
              shrink-0
              rounded-2xl
              px-5
              py-3
              text-xs
              font-extrabold
              transition-all
              active:scale-95
              ${
                activeTab === "nearest"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-500 shadow-sm ring-1 ring-gray-100"
              }
            `}
          >
            Nearest
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("free")}
            className={`
              shrink-0
              rounded-2xl
              px-5
              py-3
              text-xs
              font-extrabold
              transition-all
              active:scale-95
              ${
                activeTab === "free"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-500 shadow-sm ring-1 ring-gray-100"
              }
            `}
          >
            Free Delivery
          </button>

        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {sortedRestaurants.length === 0 && (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-sm">
              🍽️
            </div>

            <h2 className="text-lg font-extrabold text-gray-800">
              No Restaurants Available
            </h2>

            <p className="mt-2 max-w-[260px] text-xs leading-5 text-gray-400">
              We couldn't find any restaurants right now.
              Please try again later.
            </p>

          </div>
        )}

        {/* =====================================================
            RESTAURANT LIST
        ====================================================== */}

        {sortedRestaurants.length > 0 && (
          <div className="mt-5 space-y-5">

            {sortedRestaurants.map(
              (restaurant, index) => {

                const isFavourite =
                  isRestaurantFavourite(
                    restaurant.id
                  );

                const rating =
                  getRating(restaurant);

                const deliveryMinutes =
                  getDeliveryMinutes(
                    restaurant
                  );

                const hasFreeDelivery =
                  restaurant?.freeDelivery ===
                    true ||
                  restaurant?.isFreeDelivery ===
                    true;

                const image =
                  restaurant?.image ||
                  restaurant?.imageUrl ||
                  restaurant?.coverImage ||
                  restaurant?.bannerImage;

                return (
                  <motion.div
                    key={restaurant.id}
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(
                        index * 0.06,
                        0.3
                      ),
                    }}
                    onClick={() =>
                      navigate(
                        `/restaurants/${restaurant.id}`
                      )
                    }
                    className="
                      group
                      cursor-pointer
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-gray-100
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:shadow-xl
                      active:scale-[0.985]
                    "
                  >

                    {/* =================================================
                        RESTAURANT IMAGE
                    ================================================== */}

                    <div className="relative h-[190px] w-full overflow-hidden bg-gray-100">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            restaurant.name ||
                            "Restaurant"
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-gray-100
                            to-gray-200
                            text-7xl
                          "
                        >
                          🍽️
                        </div>
                      )}

                      {/* IMAGE OVERLAY */}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

                      {/* =================================================
                          FAVOURITE BUTTON
                      ================================================== */}

                      <button
                        type="button"
                        onClick={(event) =>
                          handleFavourite(
                            restaurant,
                            event
                          )
                        }
                        aria-label={
                          isFavourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                        className={`
                          absolute
                          right-3
                          top-3
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          bg-white/95
                          shadow-lg
                          backdrop-blur-sm
                          transition-all
                          active:scale-90
                          ${
                            isFavourite
                              ? "text-red-500"
                              : "text-gray-500"
                          }
                        `}
                      >
                        <Heart
                          size={20}
                          fill={
                            isFavourite
                              ? "currentColor"
                              : "none"
                          }
                          strokeWidth={2}
                        />
                      </button>

                      {/* =================================================
                          OFFER BADGE
                      ================================================== */}

                      {index === 0 && (
                        <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold text-white shadow-lg">
                          Popular
                        </div>
                      )}

                    </div>

                    {/* =================================================
                        RESTAURANT CONTENT
                    ================================================== */}

                    <div className="p-4">

                      {/* NAME + RATING */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0 flex-1">

                          <h2 className="truncate text-[18px] font-extrabold leading-tight text-gray-900">
                            {restaurant.name ||
                              "Restaurant"}
                          </h2>

                          <p className="mt-1 truncate text-[11px] font-medium text-gray-400">
                            {restaurant.category ||
                              restaurant.cuisine ||
                              "Restaurant"}{" "}
                            •{" "}
                            {restaurant.location ||
                              "Nearby"}
                          </p>

                        </div>

                        {/* RATING */}

                        <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1.5">

                          <Star
                            size={13}
                            fill="currentColor"
                            className="text-primary"
                          />

                          <span className="text-[11px] font-extrabold text-primary">
                            {rating.toFixed(1)}
                          </span>

                        </div>

                      </div>

                      {/* =================================================
                          DESCRIPTION
                      ================================================== */}

                      {restaurant.description && (
                        <p className="mt-2 line-clamp-1 text-[11px] font-medium text-gray-400">
                          {restaurant.description}
                        </p>
                      )}

                      {/* =================================================
                          INFO BADGES
                      ================================================== */}

                      <div className="mt-4 flex flex-wrap items-center gap-2">

                        {/* DELIVERY TIME */}

                        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">

                          <Clock
                            size={12}
                            className="text-primary"
                          />

                          <span className="text-[10px] font-extrabold text-primary">
                            {restaurant.deliveryTime ||
                              `${deliveryMinutes} min`}
                          </span>

                        </div>

                        {/* FREE DELIVERY */}

                        {hasFreeDelivery && (
                          <div className="rounded-full bg-yellow-50 px-3 py-1.5 text-[10px] font-extrabold text-yellow-600">
                            Free delivery
                          </div>
                        )}

                        {/* LOCATION */}

                        {restaurant.location && (
                          <div className="flex max-w-[150px] items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5">

                            <MapPin
                              size={11}
                              className="shrink-0 text-gray-400"
                            />

                            <span className="truncate text-[10px] font-bold text-gray-500">
                              {restaurant.location}
                            </span>

                          </div>
                        )}

                      </div>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          HORIZONTAL SCROLLBAR HIDDEN
      ====================================================== */}

      <style>{`
        body {
          overflow-x: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}

