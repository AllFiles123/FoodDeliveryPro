import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const { addToCart, cart } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadFood = async () => {
      try {
        setLoading(true);

        const response =
          await restaurantService.getAllRestaurants();

        const restaurants = response?.restaurants || [];

        let foundFood = null;

        for (const restaurant of restaurants) {
          try {
            const result =
              await restaurantService.getFoodsByRestaurantId(
                restaurant.id
              );

            const foods = result?.foods || [];

            const match = foods.find(
              (item) => String(item.id) === String(id)
            );

            if (match) {
              foundFood = match;
              break;
            }
          } catch (error) {
            console.error(error);
          }
        }

        setFood(foundFood);
      } catch (error) {
        console.error("Food Details Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...food,
        image: food.image || "",
      });
    }

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-orange-500">
          Loading Food...
        </p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-6xl">🍽️</div>

        <h1 className="mt-5 text-xl font-bold text-slate-800">
          Food Not Found
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="mt-5 rounded-xl bg-primary px-6 py-3 font-bold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const cartItem = cart.find(
    (item) => item.id === food.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Image */}
      <div className="relative h-80 rounded-b-[40px] bg-yellow-400 p-6 pb-12">
        <div className="flex w-full justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-white/50 p-2 backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>

          <button className="rounded-xl bg-white/50 p-2 backdrop-blur-md">
            <Info size={20} />
          </button>
        </div>

        <div className="flex justify-center">
          {food.image ? (
            <img
              src={food.image}
              alt={food.name}
              className="mt-4 h-64 w-64 object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="mt-8 text-8xl">
              🍕
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="-mt-8 px-5 pb-10">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {food.name}
              </h2>

              <div className="mt-2 flex items-center gap-1">
                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="text-sm font-semibold text-gray-500">
                  {food.rating || "4.5"}
                </span>
              </div>
            </div>

            <span className="text-lg font-bold text-primary">
              ৳ {food.price}
            </span>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-gray-500">
            {food.description ||
              "Delicious food prepared fresh for you."}
          </p>

          {/* Quantity */}
          <div className="mb-6 rounded-3xl bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">
                Quantity
              </h4>

              {cartItem && (
                <span className="text-xs font-semibold text-green-500">
                  Already in cart: {cartItem.qty}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow"
              >
                <Minus size={18} />
              </button>

              <span className="text-lg font-bold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((q) => q + 1)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Add To Cart */}
          <div className="flex items-center gap-4">
            <div className="text-lg font-black text-slate-800">
              ৳ {Number(food.price || 0) * quantity}
            </div>

            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-200 transition active:scale-95"
            >
              <ShoppingBag size={20} />
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
