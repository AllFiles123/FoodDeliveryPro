import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Info,
  Plus,
  Minus,
  ShoppingBag,
  Star,
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

  const sides = [
    "French Fries",
    "Cheesy Fries",
    "Onion Rings",
    "Nuggets",
    "Coleslaw",
    "Mozzarella Sticks",
  ];

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
          await restaurantService.getAllRestaurants();

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

  const toggleSide = (side) => {
    setSelectedSides((prev) =>
      prev.includes(side)
        ? prev.filter((item) => item !== side)
        : [...prev, side]
    );
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-green-600">
          Loading Food...
        </p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-6xl">
          🍽️
        </div>

        <h1 className="mt-5 text-xl font-bold text-slate-800">
          Food Not Found
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-bold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const cartItem = cart.find(
    (item) =>
      String(item.id) === String(food.id)
  );

  const totalPrice =
    Number(food.price || 0) * quantity;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">

      {/* ========================= */}
      {/* HERO / FOOD IMAGE */}
      {/* ========================= */}

      <div className="relative h-[480px] w-full overflow-hidden rounded-b-[55px] bg-[#E8B600]">

        {/* Header Buttons */}

        <div className="absolute top-6 left-5 right-5 z-20 flex items-center justify-between">

          <button
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-slate-700 shadow-sm backdrop-blur-md transition active:scale-95"
          >
            <ChevronLeft size={25} />
          </button>

          <button
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-slate-700 shadow-sm backdrop-blur-md transition active:scale-95"
          >
            <Info size={22} />
          </button>

        </div>

        {/* Food Image */}

        <div className="absolute inset-x-0 top-[80px] flex justify-center">

          {food.image ? (
            <img
              src={food.image}
              alt={food.name}
              className="h-[330px] w-[330px] object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.22)]"
            />
          ) : (
            <div className="flex h-[330px] w-[330px] items-center justify-center text-[150px]">
              🍔
            </div>
          )}

        </div>

      </div>

      {/* ========================= */}
      {/* FOOD INFORMATION */}
      {/* ========================= */}

      <div className="-mt-2 px-5 pb-12">

        <div className="rounded-[30px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

          {/* Name + Price */}

          <div className="flex items-start justify-between gap-5">

            <div className="flex-1">

              <h1 className="text-[25px] font-extrabold leading-tight text-slate-900">
                {food.name}
              </h1>

              {food.restaurantName && (
                <p className="mt-1 text-sm font-semibold text-gray-400">
                  {food.restaurantName}
                </p>
              )}

              {/* Rating */}

              <div className="mt-3 flex items-center gap-1">

                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="text-sm font-bold text-slate-700">
                  {food.rating || "4.5"}
                </span>

              </div>

            </div>

            <div className="whitespace-nowrap text-[20px] font-extrabold text-green-600">
              ৳ {food.price}
            </div>

          </div>

          {/* Description */}

          <p className="mt-5 text-[14px] leading-6 text-gray-500">
            {food.description ||
              "Delicious food prepared fresh for you with quality ingredients and great taste."}
          </p>

          {/* ========================= */}
          {/* SIDES */}
          {/* ========================= */}

          <div className="mt-6 rounded-[24px] bg-[#F8F8F6] p-5">

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <h3 className="text-[17px] font-extrabold text-slate-800">
                  Sides
                </h3>

                <span className="text-[10px] font-medium text-gray-400">
                  May Choose
                </span>

              </div>

              <span className="rounded-full bg-green-100 px-4 py-1.5 text-[11px] font-extrabold text-green-600">
                Free
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
                    className="flex w-full items-center gap-3 text-left"
                  >

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                        selected
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selected && (
                        <span className="text-[12px] font-black">
                          ✓
                        </span>
                      )}
                    </span>

                    <span
                      className={`text-sm ${
                        selected
                          ? "font-semibold text-slate-800"
                          : "text-gray-500"
                      }`}
                    >
                      {side}
                    </span>

                  </button>
                );
              })}

            </div>

          </div>

          {/* ========================= */}
          {/* QUANTITY + ADD CART */}
          {/* ========================= */}

          <div className="mt-7 flex items-center gap-4">

            {/* Quantity */}

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setQuantity((q) =>
                    Math.max(1, q - 1)
                  )
                }
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-sm transition active:scale-90"
              >
                <Minus size={19} />
              </button>

              <span className="min-w-[18px] text-center text-lg font-extrabold text-slate-800">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => q + 1)
                }
                className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white shadow-md shadow-green-200 transition active:scale-90"
              >
                <Plus size={19} />
              </button>

            </div>

          </div>

          {/* Already in cart */}

          {cartItem && (
            <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-center text-xs font-bold text-green-600">
              Already in cart:{" "}
              {cartItem.qty ||
                cartItem.quantity ||
                1}
            </div>
          )}

          {/* Bottom Price + Button */}

          <div className="mt-7 flex items-center gap-4">

            <div className="whitespace-nowrap text-[20px] font-black text-slate-900">
              ৳ {totalPrice}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-[16px] font-extrabold text-white shadow-lg shadow-green-200 transition active:scale-[0.98]"
            >
              <ShoppingBag size={21} />
              Add To Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FoodDetails;
