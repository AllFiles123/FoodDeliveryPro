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

  /*
   * =====================================================
   * FAVOURITE BUTTON
   *
   * IMPORTANT:
   * This button lives inside the clickable restaurant
   * card. We MUST stop the click from reaching the
   * parent card.
   * =====================================================
   */
  const handleFavourite = (restaurant, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();

      // Extra protection for nested click handlers
      if (event.nativeEvent?.stopImmediatePropagation) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }

    toggleRestaurantFavourite(restaurant);
  };

  /*
   * =====================================================
   * RESTAURANT CARD NAVIGATION
   * =====================================================
   */
  const handleRestaurantClick = (restaurant, event) => {
    /*
     * Only allow navigation when the actual card itself
     * was clicked.
     *
     * Favourite button handles and stops its own event.
     */
    if (
      event?.defaultPrevented ||
      event?.target?.closest?.(
        '[data-favourite-button="true"]'
      )
    ) {
      return;
    }

    navigate(
      `/restaurants/${restaurant.id}`
    );
  };

  const getRating = (restaurant) => {
    const rating = Number(
      restaurant?.rating
    );

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
          getRating(b) -
          getRating(a)
      );
    }

    if (activeTab === "fast") {
      return list.sort(
        (a, b) =>
          getDeliveryMinutes(a) -
          getDeliveryMinutes(b)
      );
    }

    if (activeTab === "offers") {
      return list.sort(
        (a, b) =>
          Number(
            Boolean(
              b?.freeDelivery ||
                b?.isFreeDelivery
            )
          ) -
          Number(
            Boolean(
              a?.freeDelivery ||
                a?.isFreeDelivery
            )
          )
      );
    }

    return list;
  }, [restaurants, activeTab]);

  return (
    <div className="min-h-screen bg-[#fffaf6] pb-24">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="sticky top-0 z-30 border-b border-gray-100 bg-[#fffaf6]/95 backdrop-blur-xl">

        <div className="flex items-center gap-3 px-4 py-4">

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              navigate(-1);
            }}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-gray-700
              shadow-sm
              transition
              active:scale-90
            "
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="min-w-0 flex-1">

            <h1 className="truncate text-xl font-extrabold text-gray-900">
              Restaurants
            </h1>

            <p className="mt-0.5 text-xs font-medium text-gray-400">
              Discover delicious food near you
            </p>

          </div>

        </div>

        {/* =====================================================
            FILTER TABS
        ====================================================== */}

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">

          {[
            {
              id: "top",
              label: "Top Rated",
            },
            {
              id: "fast",
              label: "Fast Delivery",
            },
            {
              id: "offers",
              label: "Free Delivery",
            },
          ].map((tab) => (

            <button
              key={tab.id}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActiveTab(tab.id);
              }}
              className={`
                shrink-0
                rounded-full
                px-4
                py-2
                text-xs
                font-bold
                transition-all
                ${
                  activeTab === tab.id
                    ? "bg-[#f29a52] text-white shadow-md"
                    : "bg-white text-gray-500 shadow-sm"
                }
              `}
            >
              {tab.label}
            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="px-4">

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="mt-6 space-y-5">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-[28px]
                  bg-white
                  shadow-sm
                  animate-pulse
                "
              >

                <div className="h-[190px] bg-gray-200" />

                <div className="space-y-3 p-4">

                  <div className="h-5 w-2/3 rounded bg-gray-200" />

                  <div className="h-3 w-1/2 rounded bg-gray-200" />

                  <div className="h-3 w-1/3 rounded bg-gray-200" />

                </div>

              </div>

            ))}

          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!loading &&
          sortedRestaurants.length === 0 && (

            <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

              <div className="
                mb-5
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-white
                text-5xl
                shadow-sm
              ">
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

        {!loading &&
          sortedRestaurants.length > 0 && (

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

                      /*
                       * IMPORTANT:
                       * Navigation is isolated here.
                       * Favourite button has its own event
                       * protection below.
                       */
                      onClick={(event) =>
                        handleRestaurantClick(
                          restaurant,
                          event
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

                      <div className="
                        relative
                        h-[190px]
                        w-full
                        overflow-hidden
                        bg-gray-100
                      ">

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

                          <div className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-gray-100
                            to-gray-200
                            text-7xl
                          ">
                            🍽️
                          </div>

                        )}

                        {/* IMAGE OVERLAY */}

                        <div className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          bottom-0
                          h-20
                          bg-gradient-to-t
                          from-black/30
                          to-transparent
                        " />

                        {/* =================================================
                            FAVOURITE BUTTON
                        ================================================== */}

                        <button
                          type="button"

                          /*
                           * Dedicated marker allows the parent card
                           * to identify this as a non-navigation area.
                           */
                          data-favourite-button="true"

                          onPointerDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}

                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}

                          onTouchStart={(event) => {
                            event.stopPropagation();
                          }}

                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            if (
                              event.nativeEvent
                                ?.stopImmediatePropagation
                            ) {
                              event.nativeEvent.stopImmediatePropagation();
                            }

                            toggleRestaurantFavourite(
                              restaurant
                            );
                          }}

                          aria-label={
                            isFavourite
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }

                          className={`
                            absolute
                            right-3
                            top-3
                            z-20
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
                            OFFER / POPULAR BADGE
                        ================================================== */}

                        {index === 0 && (

                          <div className="
                            absolute
                            left-3
                            top-3
                            rounded-full
                            bg-[#f29a52]
                            px-3
                            py-1.5
                            text-[10px]
                            font-extrabold
                            text-white
                            shadow-lg
                          ">
                            Popular
                          </div>

                        )}

                      </div>

                      {/* =================================================
                          RESTAURANT CONTENT
                      ================================================== */}

                      <div className="p-4">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0 flex-1">

                            <h2 className="
                              truncate
                              text-[17px]
                              font-extrabold
                              text-gray-900
                            ">
                              {restaurant?.name ||
                                "Restaurant"}
                            </h2>

                            <div className="
                              mt-1
                              flex
                              items-center
                              gap-1
                              text-xs
                              text-gray-400
                            ">

                              <MapPin size={13} />

                              <span className="truncate">
                                {restaurant?.address ||
                                  restaurant?.location ||
                                  "Nearby"}
                              </span>

                            </div>

                          </div>

                          <div className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-amber-50
                            px-2.5
                            py-1.5
                            text-xs
                            font-bold
                            text-amber-600
                          ">

                            <Star
                              size={13}
                              fill="currentColor"
                            />

                            {rating.toFixed(1)}

                          </div>

                        </div>

                        {/* =================================================
                            META
                        ================================================== */}

                        <div className="
                          mt-4
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        ">

                          <div className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-gray-50
                            px-3
                            py-1.5
                            text-[11px]
                            font-semibold
                            text-gray-500
                          ">

                            <Clock size={13} />

                            {deliveryMinutes} min

                          </div>

                          {hasFreeDelivery && (

                            <div className="
                              rounded-full
                              bg-green-50
                              px-3
                              py-1.5
                              text-[11px]
                              font-bold
                              text-green-600
                            ">
                              Free Delivery
                            </div>

                          )}

                          {restaurant?.cuisine && (

                            <div className="
                              max-w-[150px]
                              truncate
                              rounded-full
                              bg-orange-50
                              px-3
                              py-1.5
                              text-[11px]
                              font-bold
                              text-orange-500
                            ">
                              {restaurant.cuisine}
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

    </div>
  );
}
