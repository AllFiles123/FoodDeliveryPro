import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Star,
  Clock3,
  Flame,
  Info,
  Store,
  Check,
} from "lucide-react";

import restaurantService from "../../services/restaurantService";
import { useCart } from "../../context/CartContext";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { addToCart, cart } = useCart();

  const [food, setFood] = useState(
    location.state?.food || null
  );

  const [loading, setLoading] = useState(
    !location.state?.food
  );

  const [quantity, setQuantity] = useState(1);

  const [selectedSides, setSelectedSides] = useState([
    "French Fries",
    "Onion Rings",
    "Nuggets",
  ]);

  const [showCustomize, setShowCustomize] = useState(false);

  const sides = [
    "French Fries",
    "Cheesy Fries",
    "Onion Rings",
    "Nuggets",
    "Coleslaw",
    "Mozzarella Sticks",
  ];

  /* =========================
     LOAD FOOD
  ========================= */

  useEffect(() => {
    const loadFood = async () => {
      if (location.state?.food) {
        setFood(location.state.food);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response =
          await restaurantService.getRestaurants();

        const restaurants =
          response?.restaurants || [];

        let foundFood = null;

        for (const restaurant of restaurants) {
          try {
            const result =
              await restaurantService.getFoodsByRestaurantId(
                restaurant.id
              );

            const foods = result?.foods || [];

            const match = foods.find(
              (item) =>
                String(item.id) === String(id)
            );

            if (match) {
              foundFood = {
                ...match,
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                restaurant: restaurant,
              };

              break;
            }
          } catch (error) {
            console.error(
              "Restaurant food loading error:",
              error
            );
          }
        }

        setFood(foundFood);
      } catch (error) {
        console.error(
          "Food Details Error:",
          error
        );

        setFood(null);
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id, location.state]);

  /* =========================
     SIDE SELECTION
  ========================= */

  const toggleSide = (side) => {
    setSelectedSides((prev) =>
      prev.includes(side)
        ? prev.filter((item) => item !== side)
        : [...prev, side]
    );
  };

  /* =========================
     RESTAURANT VIEW
  ========================= */

  const handleViewRestaurant = () => {
    if (!food) return;

    const restaurantId =
      food.restaurantId ||
      food.restaurant?.id;

    if (!restaurantId) {
      return;
    }

    navigate(`/restaurants/${restaurantId}`);
  };

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = () => {
    if (!food) return;

    addToCart({
      ...food,
      image: food.image || "",
      restaurantId:
        food.restaurantId ||
        food.restaurant?.id ||
        "",
      restaurantName:
        food.restaurantName ||
        food.restaurant?.name ||
        "",
      quantity,
      sides: selectedSides,
    });

    navigate("/cart");
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6]">

        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
              <ShoppingBag
                size={25}
                className="text-orange-500"
              />
            </div>

            <p className="mt-4 text-sm font-black text-slate-800">
              Loading food...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Please wait a moment
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =========================
     FOOD NOT FOUND
  ========================= */

  if (!food) {
    return (
      <div className="min-h-screen bg-[#F8F8F6]">

        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-orange-50 text-5xl">
            🍽️
          </div>

          <h1 className="mt-5 text-xl font-black text-slate-800">
            Food Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            We couldn't find this food item.
            Please try again.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-2xl bg-orange-500 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-200 transition active:scale-95"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  /* =========================
     CART + PRICE
  ========================= */

  const cartItem = cart.find(
    (item) =>
      String(item.id) === String(food.id)
  );

  const unitPrice = Number(food.price || 0);

  const totalPrice = unitPrice * quantity;

  const restaurantName =
    food.restaurantName ||
    food.restaurant?.name ||
    "Restaurant";

  const restaurantId =
    food.restaurantId ||
    food.restaurant?.id ||
    "";

  const rating = food.rating || "4.5";

  const calories =
    food.calories ||
    food.kcal ||
    "170";

  const preparationTime =
    food.preparationTime ||
    food.time ||
    "15-30 min";

  return (
    <div className="min-h-screen bg-[#F8F8F6]">

      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-[#F8F8F6]">

        {/* =====================================================
            HERO IMAGE
        ===================================================== */}

        <div className="relative h-[430px] overflow-hidden rounded-b-[45px] bg-white">

          {/* soft background */}

          <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />

          {/* decorative circles */}

          <div className="absolute -right-16 top-20 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl" />

          <div className="absolute -left-20 bottom-12 h-40 w-40 rounded-full bg-orange-50 blur-2xl" />

          {/* HEADER */}

          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 pt-5">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/95 text-slate-700 shadow-md backdrop-blur-md transition active:scale-95"
              aria-label="Go back"
            >
              <ChevronLeft size={23} />
            </button>

            <div className="rounded-full border border-white bg-white/90 px-5 py-2.5 shadow-md backdrop-blur-md">

              <p className="text-[13px] font-black text-slate-800">
                Details
              </p>

            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/95 text-orange-500 shadow-md backdrop-blur-md transition active:scale-95"
              aria-label="Favourite"
            >
              <Heart
                size={21}
                strokeWidth={2.4}
              />
            </button>

          </div>

          {/* FOOD IMAGE */}

          <div className="absolute inset-x-0 bottom-2 top-[70px] flex items-center justify-center px-7">

            {food.image ? (
              <img
                src={food.image}
                alt={food.name}
                className="h-full w-full object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
              />
            ) : (
              <div className="flex h-[300px] w-[300px] items-center justify-center text-[140px]">
                🍔
              </div>
            )}

          </div>

          {/* image indicator */}

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">

            <span className="h-1.5 w-6 rounded-full bg-orange-500" />

            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />

            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />

          </div>

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="relative px-4 pb-8 pt-4">

          {/* ===================================================
              RESTAURANT CARD
          =================================================== */}

          <div className="rounded-[25px] border border-orange-100 bg-orange-50/70 p-3.5">

            <div className="flex items-center gap-3">

              {/* restaurant icon */}

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">

                {food.restaurant?.image ? (
                  <img
                    src={food.restaurant.image}
                    alt={restaurantName}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <Store size={21} />
                )}

              </div>

              {/* restaurant info */}

              <div className="min-w-0 flex-1">

                <p className="truncate text-[15px] font-black text-slate-800">
                  {restaurantName}
                </p>

                <p className="mt-0.5 truncate text-[10px] font-medium text-gray-400">
                  American • Burgers • Fast Food
                </p>

              </div>

              {/* VIEW */}

              <button
                type="button"
                onClick={handleViewRestaurant}
                disabled={!restaurantId}
                className="shrink-0 rounded-full bg-orange-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-200 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                View
              </button>

            </div>

          </div>

          {/* ===================================================
              FOOD TITLE + PRICE
          =================================================== */}

          <div className="mt-5 flex items-start justify-between gap-4">

            <div className="min-w-0 flex-1">

              <h1 className="text-[25px] font-black leading-[1.12] tracking-tight text-slate-900">
                {food.name}
              </h1>

            </div>

            <div className="shrink-0 text-right">

              <p className="text-[21px] font-black text-orange-500">
                ৳{unitPrice}
              </p>

            </div>

          </div>

          {/* ===================================================
              FOOD META
          =================================================== */}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">

            <div className="flex items-center gap-1.5">

              <Flame
                size={15}
                className="text-orange-500"
              />

              <span className="text-[11px] font-bold text-slate-600">
                {calories} calories
              </span>

            </div>

            <div className="h-3 w-px bg-gray-200" />

            <div className="flex items-center gap-1.5">

              <Clock3
                size={15}
                className="text-slate-400"
              />

              <span className="text-[11px] font-bold text-slate-600">
                Time {preparationTime}
              </span>

            </div>

            <div className="h-3 w-px bg-gray-200" />

            <div className="flex items-center gap-1.5">

              <Star
                size={15}
                fill="currentColor"
                className="text-orange-400"
              />

              <span className="text-[11px] font-bold text-slate-600">
                {rating} Rating
              </span>

            </div>

          </div>

          {/* ===================================================
              DESCRIPTION
          =================================================== */}

          <div className="mt-7">

            <div className="flex items-center gap-2">

              <h2 className="text-[18px] font-black text-slate-900">
                Description
              </h2>

              <Info
                size={15}
                className="text-gray-300"
              />

            </div>

            <p className="mt-2.5 text-[12px] leading-6 text-gray-500">

              {food.description ||
                "This delicious food is prepared fresh with quality ingredients. Enjoy a great combination of taste, freshness and satisfying flavor with every bite."}

            </p>

          </div>

          {/* separator */}

          <div className="my-5 border-t border-dashed border-gray-200" />

          {/* ===================================================
              CUSTOMIZE
          =================================================== */}

          <button
            type="button"
            onClick={() =>
              setShowCustomize((prev) => !prev)
            }
            className="flex w-full items-center justify-between"
          >

            <div>

              <p className="text-left text-[17px] font-black text-slate-900">
                Customize
              </p>

              <p className="mt-1 text-left text-[10px] font-medium text-gray-400">
                Choose your favourite sides
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="text-[11px] font-black text-orange-500">
                {showCustomize
                  ? "Hide Details"
                  : "More Details"}
              </span>

              {showCustomize ? (
                <ChevronUp
                  size={17}
                  className="text-orange-500"
                />
              ) : (
                <ChevronDown
                  size={17}
                  className="text-orange-500"
                />
              )}

            </div>

          </button>

          {/* ===================================================
              CUSTOMIZATION OPTIONS
          =================================================== */}

          {showCustomize && (
            <div className="mt-4 rounded-[22px] bg-white p-4 shadow-sm">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-xs font-black text-slate-800">
                  Select Sides
                </p>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-[9px] font-black text-orange-500">
                  FREE
                </span>

              </div>

              <div className="space-y-3">

                {sides.map((side) => {

                  const selected =
                    selectedSides.includes(side);

                  return (
                    <button
                      key={side}
                      type="button"
                      onClick={() => toggleSide(side)}
                      className="flex w-full items-center justify-between rounded-xl py-1 text-left"
                    >

                      <span className="flex items-center gap-3">

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                            selected
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >

                          {selected && (
                            <Check size={12} />
                          )}

                        </span>

                        <span
                          className={`text-xs ${
                            selected
                              ? "font-bold text-slate-800"
                              : "font-medium text-gray-500"
                          }`}
                        >
                          {side}
                        </span>

                      </span>

                    </button>
                  );
                })}

              </div>

            </div>
          )}

          {/* ===================================================
              QUANTITY
          =================================================== */}

          <div className="mt-6 flex items-center justify-between">

            <div>

              <p className="text-[11px] font-bold text-gray-400">
                Quantity
              </p>

              <div className="mt-2 flex items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-sm transition active:scale-90"
                >
                  <Minus size={17} />
                </button>

                <span className="min-w-[24px] text-center text-base font-black text-slate-800">
                  {String(quantity).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => q + 1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md shadow-orange-200 transition active:scale-90"
                >
                  <Plus size={17} />
                </button>

              </div>

            </div>

            <div className="text-right">

              <p className="text-[10px] font-bold text-gray-400">
                Total
              </p>

              <p className="mt-1 text-[21px] font-black text-slate-900">
                ৳{totalPrice}
              </p>

            </div>

          </div>

          {/* ===================================================
              CART STATUS
          =================================================== */}

          {cartItem && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-orange-50 px-4 py-3">

              <Check
                size={15}
                className="text-orange-500"
              />

              <span className="text-[11px] font-bold text-orange-600">
                Already in cart:{" "}
                {cartItem.qty ||
                  cartItem.quantity ||
                  1}
              </span>

            </div>
          )}

          {/* ===================================================
              ADD TO CART
          =================================================== */}

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-[20px] bg-orange-500 py-4 text-[15px] font-black text-white shadow-xl shadow-orange-200 transition active:scale-[0.98]"
          >

            <ShoppingBag size={20} />

            Add to Cart

          </button>

        </div>

      </div>

    </div>
  );
};

export default FoodDetails;
