import React, { useState } from "react";
import {
  Heart,
  Flame,
  Star,
  MapPin,
  Clock,
  Utensils,
  Store,
  ChevronRight,
  ShoppingBag,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFavourite } from "../../context/FavouriteContext";
import {
  getFavouriteVideos,
  removeFavouriteVideo,
} from "../../utils/favouriteVideoStorage";

const Favourite = () => {
  const navigate = useNavigate();

  const {
    favourites,
    removeItemFavourite,
    removeRestaurantFavourite,
  } = useFavourite();

  const [activeTab, setActiveTab] = useState("items");

  const [favouriteVideos, setFavouriteVideos] =
    useState(() =>
      getFavouriteVideos()
    );

  React.useEffect(() => {
    const refreshFavouriteVideos = () => {
      setFavouriteVideos(
        getFavouriteVideos()
      );
    };

    window.addEventListener(
      "favourite-videos-updated",
      refreshFavouriteVideos
    );

    window.addEventListener(
      "storage",
      refreshFavouriteVideos
    );

    return () => {
      window.removeEventListener(
        "favourite-videos-updated",
        refreshFavouriteVideos
      );

      window.removeEventListener(
        "storage",
        refreshFavouriteVideos
      );
    };
  }, []);

  const favouriteItems = favourites?.items || [];
  const favouriteRestaurants =
    favourites?.restaurants || [];

  const totalFavourite =
    favouriteItems.length +
    favouriteRestaurants.length +
    favouriteVideos.length;

  const handleFoodOpen = (item, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    navigate(`/food/${item.id}`, {
      state: {
        food: item,
      },
    });
  };

  const handleRestaurantOpen = (
    restaurant,
    event
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    navigate(
      `/restaurants/${restaurant.id}`
    );
  };

  const handleRemoveFood = (item, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    removeItemFavourite(item.id);
  };

  const handleRemoveRestaurant = (
    restaurant,
    event
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    removeRestaurantFavourite(
      restaurant.id
    );
  };

  return (
    <div className="min-h-screen bg-[#fffaf6] pb-28">

      <div className="mx-auto w-full max-w-md px-4">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative overflow-hidden pb-5 pt-5">

          <div className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-orange-100/60
            blur-3xl
          " />

          <div className="relative">

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-2xl
                    bg-orange-50
                    text-[#f29a52]
                  ">
                    <Heart
                      size={21}
                      fill="currentColor"
                    />
                  </div>

                  <div>

                    <h1 className="
                      text-[22px]
                      font-black
                      tracking-tight
                      text-slate-900
                    ">
                      Favorites
                    </h1>

                    <p className="
                      mt-0.5
                      text-[11px]
                      font-semibold
                      text-gray-400
                    ">
                      Your favorite food & restaurants
                    </p>

                  </div>

                </div>

              </div>

              <div className="
                flex
                items-center
                gap-1.5
                rounded-full
                bg-white
                px-3
                py-2
                shadow-sm
                ring-1
                ring-gray-100
              ">

                <Heart
                  size={13}
                  className="text-[#f29a52]"
                  fill="currentColor"
                />

                <span className="
                  text-xs
                  font-extrabold
                  text-gray-600
                ">
                  {totalFavourite}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="
          mb-6
          flex
          rounded-[20px]
          border
          border-gray-100
          bg-white
          p-1.5
          shadow-sm
        ">

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveTab("items");
            }}
            className={`
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-[15px]
              py-3
              text-xs
              font-extrabold
              transition-all
              duration-300
              ${
                activeTab === "items"
                  ? "bg-[#f29a52] text-white shadow-md"
                  : "text-gray-400"
              }
            `}
          >
            <ShoppingBag size={14} />

            Food

            <span className="
              rounded-full
              bg-black/5
              px-1.5
              py-0.5
              text-[9px]
            ">
              {favouriteItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveTab("restaurants");
            }}
            className={`
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-[15px]
              py-3
              text-xs
              font-extrabold
              transition-all
              duration-300
              ${
                activeTab === "restaurants"
                  ? "bg-[#f29a52] text-white shadow-md"
                  : "text-gray-400"
              }
            `}
          >
            <Store size={14} />

            Restaurants

            <span className="
              rounded-full
              bg-black/5
              px-1.5
              py-0.5
              text-[9px]
            ">
              {favouriteRestaurants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveTab("videos");
            }}
            className={`
              flex
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-[15px]
              py-3
              text-xs
              font-extrabold
              transition-all
              duration-300
              ${
                activeTab === "videos"
                  ? "bg-[#f29a52] text-white shadow-md"
                  : "text-gray-400"
              }
            `}
          >
            <Play size={14} />

            Videos

            <span
              className={`
                rounded-full
                px-1.5
                py-0.5
                text-[9px]
                ${
                  activeTab === "videos"
                    ? "bg-white/20 text-white"
                    : "bg-black/5"
                }
              `}
            >
              {favouriteVideos.length}
            </span>
          </button>

        </div>

        {/* =====================================================
            FAVOURITE FOOD
        ====================================================== */}

        {activeTab === "items" && (

          favouriteItems.length === 0 ? (

            <EmptyState
              icon={
                <Heart
                  size={36}
                  strokeWidth={1.7}
                />
              }
              title="No Favourite Food"
              description="Save the food you love and find it here anytime."
            />

          ) : (

            <div className="grid grid-cols-2 gap-4">

              {favouriteItems.map((item) => (

                <div
                  key={item.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[25px]
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-lg
                  "
                >

                  {/* =================================================
                      FOOD IMAGE
                  ================================================== */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleFoodOpen(
                        item,
                        event
                      )
                    }
                    className="
                      block
                      w-full
                      text-left
                    "
                  >

                    <div className="
                      relative
                      h-[145px]
                      w-full
                      overflow-hidden
                      bg-orange-50
                    ">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={
                            item.name ||
                            "Food"
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
                          text-5xl
                        ">
                          🍔
                        </div>

                      )}

                      <div className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-16
                        bg-gradient-to-t
                        from-black/30
                        to-transparent
                      " />

                    </div>

                  </button>

                  {/* =================================================
                      REMOVE HEART
                  ================================================== */}

                  <button
                    type="button"
                    data-favourite-button="true"
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={(event) =>
                      handleRemoveFood(
                        item,
                        event
                      )
                    }
                    aria-label="Remove food from favourites"
                    className="
                      absolute
                      right-3
                      top-3
                      z-20
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white/95
                      text-[#f29a52]
                      shadow-md
                      backdrop-blur-sm
                      transition
                      active:scale-90
                    "
                  >
                    <Heart
                      size={16}
                      fill="currentColor"
                    />
                  </button>

                  {/* =================================================
                      FOOD CONTENT
                  ================================================== */}

                  <div className="p-3">

                    <button
                      type="button"
                      onClick={(event) =>
                        handleFoodOpen(
                          item,
                          event
                        )
                      }
                      className="
                        block
                        w-full
                        text-left
                      "
                    >

                      <h3 className="
                        truncate
                        text-[14px]
                        font-extrabold
                        text-slate-800
                      ">
                        {item.name ||
                          "Food Item"}
                      </h3>

                      {item.restaurantName && (

                        <p className="
                          mt-1
                          truncate
                          text-[10px]
                          font-semibold
                          text-gray-400
                        ">
                          {item.restaurantName}
                        </p>

                      )}

                    </button>

                    {/* INFO */}

                    <div className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      gap-2
                    ">

                      <span className="
                        flex
                        items-center
                        rounded-lg
                        bg-orange-50
                        px-2
                        py-1
                        text-[9px]
                        font-extrabold
                        text-orange-500
                      ">
                        <Flame
                          size={10}
                          className="mr-1"
                        />

                        {item.calories ||
                          item.cal ||
                          "--"}{" "}
                        Kal
                      </span>

                      <span className="
                        text-sm
                        font-black
                        text-[#f29a52]
                      ">
                        ৳ {item.price ?? "0"}
                      </span>

                    </div>

                    {/* RATING */}

                    <div className="
                      mt-2
                      flex
                      items-center
                      gap-1
                    ">

                      <Star
                        size={11}
                        fill="currentColor"
                        className="text-yellow-400"
                      />

                      <span className="
                        text-[10px]
                        font-bold
                        text-gray-500
                      ">
                        {item.rating ||
                          "4.5"}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )

        )}

        {/* =====================================================
            FAVOURITE RESTAURANTS
        ====================================================== */}

        {activeTab === "restaurants" && (

          favouriteRestaurants.length === 0 ? (

            <EmptyState
              icon={
                <Store
                  size={36}
                  strokeWidth={1.7}
                />
              }
              title="No Favourite Restaurants"
              description="Save restaurants you love and access them quickly here."
            />

          ) : (

            <div className="space-y-4">

              {favouriteRestaurants.map(
                (restaurant) => (

                  <div
                    key={restaurant.id}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[27px]
                      border
                      border-gray-100
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:shadow-lg
                    "
                  >

                    {/* =================================================
                        RESTAURANT IMAGE
                    ================================================== */}

                    <button
                      type="button"
                      onClick={(event) =>
                        handleRestaurantOpen(
                          restaurant,
                          event
                        )
                      }
                      className="
                        block
                        w-full
                        text-left
                      "
                    >

                      <div className="
                        relative
                        h-[175px]
                        w-full
                        overflow-hidden
                        bg-orange-50
                      ">

                        {restaurant.image ||
                        restaurant.imageUrl ||
                        restaurant.coverImage ||
                        restaurant.bannerImage ? (

                          <img
                            src={
                              restaurant.image ||
                              restaurant.imageUrl ||
                              restaurant.coverImage ||
                              restaurant.bannerImage
                            }
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
                            text-6xl
                          ">
                            🍽️
                          </div>

                        )}

                        <div className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          bottom-0
                          h-24
                          bg-gradient-to-t
                          from-black/40
                          to-transparent
                        " />

                      </div>

                    </button>

                    {/* =================================================
                        REMOVE RESTAURANT
                    ================================================== */}

                    <button
                      type="button"
                      data-favourite-button="true"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onClick={(event) =>
                        handleRemoveRestaurant(
                          restaurant,
                          event
                        )
                      }
                      aria-label="Remove restaurant from favourites"
                      className="
                        absolute
                        right-4
                        top-4
                        z-20
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        text-[#f29a52]
                        shadow-lg
                        backdrop-blur-sm
                        transition
                        active:scale-90
                      "
                    >
                      <Heart
                        size={18}
                        fill="currentColor"
                      />
                    </button>

                    {/* =================================================
                        RESTAURANT CONTENT
                    ================================================== */}

                    <div className="p-4">

                      <button
                        type="button"
                        onClick={(event) =>
                          handleRestaurantOpen(
                            restaurant,
                            event
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                        "
                      >

                        <div className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        ">

                          <div className="min-w-0">

                            <h3 className="
                              truncate
                              text-[18px]
                              font-black
                              text-slate-800
                            ">
                              {restaurant.name ||
                                "Restaurant"}
                            </h3>

                            {restaurant.description && (

                              <p className="
                                mt-1
                                line-clamp-2
                                text-xs
                                leading-5
                                text-gray-400
                              ">
                                {
                                  restaurant.description
                                }
                              </p>

                            )}

                          </div>

                          <span className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-yellow-50
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-extrabold
                            text-yellow-600
                          ">

                            <Star
                              size={11}
                              fill="currentColor"
                            />

                            {restaurant.rating ||
                              "4.5"}

                          </span>

                        </div>

                      </button>

                      {/* =================================================
                          META
                      ================================================== */}

                      <div className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                      ">

                        {restaurant.deliveryTime && (

                          <span className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-orange-50
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            text-orange-500
                          ">

                            <Clock size={11} />

                            {restaurant.deliveryTime}

                          </span>

                        )}

                        {(restaurant.location ||
                          restaurant.address) && (

                          <span className="
                            flex
                            max-w-full
                            items-center
                            gap-1.5
                            rounded-full
                            bg-gray-50
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            text-gray-500
                          ">

                            <MapPin size={11} />

                            <span className="truncate">
                              {restaurant.location ||
                                restaurant.address}
                            </span>

                          </span>

                        )}

                      </div>

                      {/* =================================================
                          VIEW MENU
                      ================================================== */}

                      <button
                        type="button"
                        onClick={(event) =>
                          handleRestaurantOpen(
                            restaurant,
                            event
                          )
                        }
                        className="
                          mt-4
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-full
                          bg-[#f29a52]
                          py-3
                          text-xs
                          font-extrabold
                          text-white
                          shadow-md
                          shadow-orange-100
                          transition-all
                          active:scale-[0.98]
                        "
                      >

                        <Utensils size={14} />

                        View Menu

                        <ChevronRight
                          size={15}
                        />

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )

        )}

      </div>

      <style>{`
        body {
          overflow-x: hidden;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>

    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="
      flex
      min-h-[55vh]
      flex-col
      items-center
      justify-center
      px-5
      text-center
    ">

      <div className="
        mb-5
        flex
        h-24
        w-24
        items-center
        justify-center
        rounded-full
        bg-orange-50
        text-[#f29a52]
      ">
        {icon}
      </div>

      <h2 className="
        text-lg
        font-black
        text-slate-800
      ">
        {title}
      </h2>

      <p className="
        mt-2
        max-w-[270px]
        text-xs
        leading-5
        text-gray-400
      ">
        {description}
      </p>

    </div>
  );
}

export default Favourite;
