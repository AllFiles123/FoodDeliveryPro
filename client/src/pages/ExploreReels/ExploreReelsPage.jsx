import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Check,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import restaurantService from "../../services/restaurantService";
import { useCart } from "../../context/CartContext";
import { useFavourite } from "../../context/FavouriteContext";
import { useToast } from "../../context/ToastContext";
import {
  isFavouriteVideo,
  toggleFavouriteVideo,
} from "../../utils/favouriteVideoStorage";


const FALLBACK_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
];


export default function ExploreReelsPage() {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    isRestaurantFavourite,
    toggleRestaurantFavourite,
  } = useFavourite();

  const { showToast } = useToast();

  const [restaurants, setRestaurants] =
    useState([]);

  const [foodsByRestaurant, setFoodsByRestaurant] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [expandedId, setExpandedId] =
    useState(null);

  const [muted, setMuted] =
    useState(true);

  const [favouriteVideoIds, setFavouriteVideoIds] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "foodDeliveryProFavouriteVideos"
          ) || "[]"
        ).map((video) => String(video.id));
      } catch {
        return [];
      }
    });

  const [addedFoodId, setAddedFoodId] =
    useState(null);

  const containerRef = useRef(null);

  const videoRefs = useRef({});

  /*
   * ============================================================
   * LOAD RESTAURANTS
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadRestaurants = async () => {
      try {
        const response =
          await restaurantService.getRestaurants();

        const restaurantList =
          Array.isArray(response)
            ? response
            : response?.restaurants || [];

        if (!mounted) return;

        setRestaurants(restaurantList);

        /*
         * Load restaurant foods.
         *
         * This allows the Add To Cart button on
         * the video to use a real food item.
         */

        const foodResults = {};

        await Promise.all(
          restaurantList.map(
            async (restaurant) => {
              try {
                const response =
                  await restaurantService
                    .getFoodsByRestaurantId(
                      restaurant.id
                    );

                foodResults[restaurant.id] =
                  response?.foods || [];
              } catch {
                foodResults[restaurant.id] = [];
              }
            }
          )
        );

        if (mounted) {
          setFoodsByRestaurant(
            foodResults
          );
        }
      } catch (error) {
        console.error(
          "Explore reels loading error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRestaurants();

    return () => {
      mounted = false;
    };
  }, []);


  /*
   * ============================================================
   * VIDEO DATA
   * ============================================================
   *
   * If backend already provides:
   *
   * videoUrl
   * video
   * reelUrl
   * reelVideo
   *
   * those will automatically be used.
   */

  const reels = useMemo(() => {
    return restaurants.map(
      (restaurant, index) => {
        const foods =
          foodsByRestaurant[
            restaurant.id
          ] || [];

        const featuredFood =
          foods[0] || null;

        const videoUrl =
          restaurant.videoUrl ||
          restaurant.video ||
          restaurant.reelUrl ||
          restaurant.reelVideo ||
          FALLBACK_VIDEOS[
            index %
              FALLBACK_VIDEOS.length
          ];

        return {
          id: restaurant.id,

          restaurant,

          food: featuredFood,

          videoUrl,

          name:
            restaurant.name ||
            "Restaurant",

          image:
            restaurant.image ||
            restaurant.logo ||
            restaurant.profileImage ||
            featuredFood?.image ||
            "",

          description:
            restaurant.description ||
            restaurant.about ||
            "Discover delicious food, fresh ingredients and great dishes from this restaurant.",

          rating:
            restaurant.rating ||
            "4.5",

          address:
            restaurant.address ||
            "Bangladesh",

          tags:
            restaurant.tags ||
            restaurant.categories ||
            [
              "Popular",
              "Fresh Food",
              "Fast Delivery",
            ],
        };
      }
    );
  }, [
    restaurants,
    foodsByRestaurant,
  ]);


  /*
   * ============================================================
   * OBSERVE ACTIVE VIDEO
   * ============================================================
   */

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) return;

    const sections =
      Array.from(
        container.querySelectorAll(
          "[data-reel-index]"
        )
      );

    if (!sections.length) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting &&
                entry.intersectionRatio >= 0.65
              ) {
                const index = Number(
                  entry.target.dataset
                    .reelIndex
                );

                setActiveIndex(index);
              }
            }
          );
        },
        {
          root: container,
          threshold: [0.65],
        }
      );

    sections.forEach(
      (section) =>
        observer.observe(section)
    );

    return () =>
      observer.disconnect();
  }, [reels.length]);


  /*
   * ============================================================
   * PLAY / PAUSE ACTIVE VIDEO
   * ============================================================
   */

  useEffect(() => {
    Object.entries(
      videoRefs.current
    ).forEach(
      ([index, video]) => {
        if (!video) return;

        const isActive =
          Number(index) === activeIndex;

        if (isActive) {
          video
            .play()
            .catch(() => {});
        } else {
          video.pause();
        }
      }
    );
  }, [activeIndex]);


  /*
   * ============================================================
   * FAVOURITE
   * ============================================================
   */

  const handleFavourite = (
    reel,
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!reel?.id) return;

    const wasFavourite =
      isFavouriteVideo(reel.id);

    const saved =
      toggleFavouriteVideo(reel);

    setFavouriteVideoIds((current) => {
      if (saved) {
        return Array.from(
          new Set([
            ...current,
            String(reel.id),
          ])
        );
      }

      return current.filter(
        (id) =>
          id !== String(reel.id)
      );
    });

    showToast(
      wasFavourite
        ? "Video removed from favourites"
        : "Video saved to favourites",
      wasFavourite
        ? "info"
        : "success"
    );
  };


  /*
   * ============================================================
   * ADD TO CART
   * ============================================================
   */

  const handleAddToCart = (
    reel,
    event
  ) => {
    event.stopPropagation();

    const food = reel.food;

    if (!food?.id) {
      showToast(
        "No food item available for this restaurant",
        "info"
      );
      return;
    }

    addToCart({
      ...food,

      restaurantId:
        reel.restaurant.id,

      restaurantName:
        reel.restaurant.name,
    });

    setAddedFoodId(food.id);

    showToast(
      `${food.name || "Food"} added to cart`,
      "success"
    );

    setTimeout(() => {
      setAddedFoodId(null);
    }, 1400);
  };


  /*
   * ============================================================
   * SHARE
   * ============================================================
   */

  const handleShare = async (
    reel,
    event
  ) => {
    event.stopPropagation();

    const shareUrl =
      `${window.location.origin}/restaurants/${reel.restaurant.id}`;

    const shareData = {
      title:
        reel.restaurant.name,

      text:
        `Check out ${reel.restaurant.name} on FoodDeliveryPro`,

      url: shareUrl,
    };

    try {
      if (
        navigator.share
      ) {
        await navigator.share(
          shareData
        );

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      showToast(
        "Restaurant link copied",
        "success"
      );
    } catch (error) {
      if (
        error?.name !==
        "AbortError"
      ) {
        try {
          await navigator.clipboard.writeText(
            shareUrl
          );

          showToast(
            "Restaurant link copied",
            "success"
          );
        } catch {
          showToast(
            "Unable to share link",
            "error"
          );
        }
      }
    }
  };


  /*
   * ============================================================
   * RESTAURANT OPEN
   * ============================================================
   */

  const openRestaurant = (
    reel,
    event
  ) => {
    event.stopPropagation();

    navigate(
      `/restaurants/${reel.restaurant.id}`
    );
  };


  /*
   * ============================================================
   * TOGGLE DETAILS
   * ============================================================
   */

  const toggleDetails = (
    reel,
    event
  ) => {
    event.stopPropagation();

    setExpandedId(
      (current) =>
        current === reel.id
          ? null
          : reel.id
    );
  };


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#FF5A00]" />

          <p className="text-sm font-bold">
            Loading Explore...
          </p>
        </div>
      </div>
    );
  }


  /*
   * ============================================================
   * EMPTY
   * ============================================================
   */

  if (!reels.length) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black px-6 text-center text-white">

        <div>
          <p className="text-lg font-extrabold">
            No restaurants available
          </p>

          <p className="mt-2 text-sm text-white/50">
            Explore content will appear here
            when restaurants are available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mt-6 rounded-full bg-[#FF5A00] px-6 py-3 text-sm font-extrabold"
          >
            Go Back
          </button>
        </div>

      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-[10000] bg-black">

      {/* ======================================================
          TOP HEADER
          ====================================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[100] flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xl transition active:scale-90"
          aria-label="Back"
        >
          <ArrowLeft
            size={22}
            strokeWidth={2.5}
          />
        </button>

        <div className="rounded-full bg-black/40 px-4 py-2 text-xs font-extrabold text-white backdrop-blur-xl">
          Explore
        </div>

        <button
          type="button"
          onClick={() =>
            setMuted(
              (value) => !value
            )
          }
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xl transition active:scale-90"
          aria-label={
            muted
              ? "Unmute video"
              : "Mute video"
          }
        >
          {muted ? (
            <VolumeX size={19} />
          ) : (
            <Volume2 size={19} />
          )}
        </button>

      </div>


      {/* ======================================================
          REELS CONTAINER
          ====================================================== */}

      <div
        ref={containerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
        style={{
          scrollbarWidth: "none",
        }}
      >

        {reels.map(
          (reel, index) => {
            const isActive =
              index === activeIndex;

            const isFavourite =
              favouriteVideoIds.includes(
                String(reel.id)
              );

            const isExpanded =
              expandedId === reel.id;

            const food =
              reel.food;

            const isAdded =
              addedFoodId === food?.id;

            return (
              <section
                key={reel.id}
                data-reel-index={index}
                className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black"
              >

                {/* ==================================================
                    VIDEO
                    ================================================== */}

                <video
                  ref={(element) => {
                    videoRefs.current[
                      index
                    ] = element;
                  }}
                  src={reel.videoUrl}
                  muted={muted}
                  loop
                  playsInline
                  preload={
                    isActive
                      ? "auto"
                      : "metadata"
                  }
                  className="absolute inset-0 h-full w-full object-cover"
                  onClick={(event) => {
                    const video =
                      event.currentTarget;

                    if (
                      video.paused
                    ) {
                      video
                        .play()
                        .catch(() => {});
                    } else {
                      video.pause();
                    }
                  }}
                />

                {/* ==================================================
                    VIDEO GRADIENT
                    ================================================== */}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/90" />


                {/* ==================================================
                    PLAY INDICATOR
                    ================================================== */}

                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
                      <Play
                        size={27}
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}


                {/* ==================================================
                    RIGHT ACTIONS
                    ================================================== */}

                <div className="absolute right-3 bottom-[185px] z-30 flex flex-col items-center gap-5">

                  {/* FAVOURITE */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleFavourite(
                        reel,
                        event
                      )
                    }
                    className="flex flex-col items-center gap-1.5 text-white"
                    aria-label={
                      isFavourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-black/45 backdrop-blur-xl transition active:scale-90 ${
                      isFavourite
                        ? "text-[#f29a52]"
                        : "text-white"
                    }`}>
                      <Heart
                        size={24}
                        fill={
                          isFavourite
                            ? "currentColor"
                            : "none"
                        }
                        strokeWidth={2.3}
                      />
                    </span>

                    <span className="text-[10px] font-bold text-white">
                      Favourite
                    </span>
                  </button>


                  {/* SHARE */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleShare(
                        reel,
                        event
                      )
                    }
                    className="flex flex-col items-center gap-1.5 text-white"
                    aria-label="Share"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 backdrop-blur-xl transition active:scale-90">
                      <Share2
                        size={23}
                        strokeWidth={2.3}
                      />
                    </span>

                    <span className="text-[10px] font-bold">
                      Share
                    </span>
                  </button>


                  {/* ADD TO CART */}

                  <button
                    type="button"
                    onClick={(event) =>
                      handleAddToCart(
                        reel,
                        event
                      )
                    }
                    className="flex flex-col items-center gap-1.5 text-white"
                    aria-label="Add to cart"
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl transition active:scale-90 ${
                      isAdded
                        ? "bg-green-500"
                        : "bg-[#FF5A00]"
                    }`}>
                      {isAdded ? (
                        <Check
                          size={23}
                          strokeWidth={3}
                        />
                      ) : (
                        <ShoppingCart
                          size={22}
                          strokeWidth={2.4}
                        />
                      )}
                    </span>

                    <span className="text-[10px] font-bold">
                      {isAdded
                        ? "Added"
                        : "Cart"}
                    </span>
                  </button>

                </div>


                {/* ==================================================
                    BOTTOM RESTAURANT INFO
                    ================================================== */}

                <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pr-20">

                  <div className="flex items-end gap-3">

                    {/* PROFILE IMAGE */}

                    <button
                      type="button"
                      onClick={(event) =>
                        openRestaurant(
                          reel,
                          event
                        )
                      }
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-xl"
                      aria-label={`Open ${reel.name}`}
                    >
                      {reel.image ? (
                        <img
                          src={reel.image}
                          alt={reel.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#FF5A00] text-lg font-black text-white">
                          {reel.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </button>


                    {/* INFO */}

                    <div className="min-w-0 flex-1">

                      <button
                        type="button"
                        onClick={(event) =>
                          openRestaurant(
                            reel,
                            event
                          )
                        }
                        className="block max-w-full text-left"
                      >
                        <h2 className="truncate text-base font-extrabold text-white">
                          {reel.name}
                        </h2>
                      </button>


                      <div className="mt-1 flex items-center gap-2">

                        <span className="flex items-center gap-1 text-[11px] font-bold text-white/80">
                          <Star
                            size={12}
                            fill="currentColor"
                            className="text-yellow-400"
                          />

                          {reel.rating}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-white/50" />

                        <span className="flex items-center gap-1 truncate text-[11px] font-semibold text-white/70">
                          <MapPin size={11} />
                          {reel.address}
                        </span>

                      </div>


                      {/* DESCRIPTION */}

                      <p
                        className={`mt-2 text-[12px] leading-relaxed text-white/80 ${
                          isExpanded
                            ? ""
                            : "line-clamp-2"
                        }`}
                      >
                        {reel.description}
                      </p>


                      {/* SEE MORE */}

                      <button
                        type="button"
                        onClick={(event) =>
                          toggleDetails(
                            reel,
                            event
                          )
                        }
                        className="mt-1 flex items-center gap-1 text-[11px] font-extrabold text-white"
                      >
                        {isExpanded
                          ? "See Less"
                          : "See More"}

                        {isExpanded ? (
                          <ChevronUp
                            size={14}
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                          />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* ==================================================
                      EXPANDED DETAILS
                      ================================================== */}

                  {isExpanded && (
                    <div className="mt-4 rounded-[22px] border border-white/10 bg-black/55 p-4 backdrop-blur-xl">

                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/45">
                        Restaurant Details
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {Array.isArray(
                          reel.tags
                        ) &&
                          reel.tags.map(
                            (tag, tagIndex) => (
                              <span
                                key={`${tag}-${tagIndex}`}
                                className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/85"
                              >
                                {typeof tag ===
                                "string"
                                  ? tag
                                  : tag?.name ||
                                    "Popular"}
                              </span>
                            )
                          )}

                      </div>


                      {food && (
                        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3">

                          <div className="min-w-0">

                            <p className="text-[10px] font-bold text-white/50">
                              Featured Food
                            </p>

                            <p className="truncate text-sm font-extrabold text-white">
                              {food.name ||
                                food.title ||
                                "Food Item"}
                            </p>

                            {food.price !==
                              undefined && (
                              <p className="mt-0.5 text-xs font-extrabold text-[#FFB800]">
                                ৳ {food.price}
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={(event) =>
                              handleAddToCart(
                                reel,
                                event
                              )
                            }
                            className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-extrabold text-white ${
                              isAdded
                                ? "bg-green-500"
                                : "bg-[#FF5A00]"
                            }`}
                          >
                            {isAdded ? (
                              <Check
                                size={15}
                                strokeWidth={3}
                              />
                            ) : (
                              <ShoppingCart
                                size={15}
                              />
                            )}

                            {isAdded
                              ? "Added"
                              : "Add"}
                          </button>

                        </div>
                      )}

                    </div>
                  )}

                </div>

              </section>
            );
          }
        )}

      </div>


      {/* ========================================================
          SWIPE HINT
          ======================================================== */}

      {activeIndex === 0 &&
        reels.length > 1 && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-black/35 px-4 py-2 text-[10px] font-bold text-white/70 backdrop-blur-md">
            Swipe up for more
          </div>
        )}

    </div>
  );
}
