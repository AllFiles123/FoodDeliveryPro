import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Heart,
  Share2,
  Check,
  Settings,
  X,
  MessageSquare,
  Send,
} from "lucide-react";

import restaurantService from "../../services/restaurantService";
import FlyToCartAnimation from "../../components/animations/FlyToCartAnimation";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, cart } = useCart();
  const { showToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [flyAnimation, setFlyAnimation] = useState(false);
  const [flyImage, setFlyImage] = useState("");
  const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await restaurantService.getRestaurantById(id);

        const foodRes =
          await restaurantService.getFoodsByRestaurantId(id);

        setRestaurant(res.restaurant);
        setFoods(foodRes.foods || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /*
   * Check whether food is already inside cart.
   * As long as the item remains in cart,
   * the button will stay as ✓.
   */
  const isFoodInCart = (foodId) => {
    return cart?.some(
      (item) => String(item.id) === String(foodId)
    );
  };

  const handleAddToCart = (food, event) => {
    event.stopPropagation();

    if (isFoodInCart(food.id)) {
      showToast("Already in cart 🛒", "info");
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    setFlyImage(food.image || "");

    setFlyStart({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    setFlyAnimation(true);

    setTimeout(() => {
      setFlyAnimation(false);
    }, 1000);

    addToCart({
      ...food,
      restaurantId: id,
      restaurantName: restaurant?.name,
    });

    showToast("Added to cart 🛒", "success");
  };

  const handleSubmitReview = () => {
    if (!userRating) {
      showToast("Please select a rating ⭐", "error");
      return;
    }

    showToast("Review submitted successfully ⭐", "success");

    setReviewText("");
    setUserRating(0);
    setIsRatingModalOpen(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-orange-500 font-bold">
        Loading...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-gray-500">
          Restaurant not found
        </p>
      </div>
    );
  }

  /*
   * Create unique food categories.
   */
  const categories = [
    ...new Set(
      foods
        .map((food) => food.category)
        .filter(Boolean)
    ),
  ];

  /*
   * First three foods are Featured Items.
   */
  const featuredItems = foods.slice(0, 3);

  /*
   * Demo reviews for UI.
   * Existing restaurant API remains untouched.
   */
  const reviews = [
    {
      id: 1,
      name: "Rahim Ahmed",
      rating: 5,
      text: "Food quality was excellent and delivery was very fast.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      rating: 4,
      text: "Really tasty food. The portion size was also good.",
      date: "5 days ago",
    },
    {
      id: 3,
      name: "Sakib Hasan",
      rating: 5,
      text: "Amazing experience. Definitely ordering again.",
      date: "1 week ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10">

      {/* ========================= */}
      {/* HEADER IMAGE */}
      {/* ========================= */}

      <div className="relative h-72 w-full">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-6 left-5 right-5 flex justify-between items-center">

          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/30 backdrop-blur-md rounded-full text-white"
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-white font-bold text-lg">
            Info
          </span>

          <button
            className="p-2 bg-white/30 backdrop-blur-md rounded-full text-white"
          >
            <Settings size={20} />
          </button>

        </div>
      </div>

      <div className="px-5 -mt-20 relative z-10">

        {/* ========================= */}
        {/* RESTAURANT INFO CARD */}
        {/* ========================= */}

        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-100">

          <h1 className="text-2xl font-bold text-slate-800">
            {restaurant.name}
          </h1>

          <p className="text-gray-400 text-xs mt-1">
            {restaurant.address || "Dhaka, Bangladesh"}
          </p>

          <div className="mt-3">

            <div className="flex items-center gap-1">

              <span className="text-slate-800 font-bold text-sm">
                {restaurant.rating || "4.5"}
              </span>

              <div className="flex text-yellow-400">
                <Star size={14} fill="currentColor" />
              </div>

              <span className="text-gray-400 text-[11px] ml-1">
                (187)
              </span>

            </div>

            {/* SEE REVIEW */}

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="text-orange-500 text-[11px] font-bold mt-1 underline"
            >
              See Review
            </button>

          </div>

          <div className="flex justify-between items-end mt-5">

            <div className="flex gap-6">

              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
                  Delivery
                </p>

                <p className="text-slate-800 font-bold text-xs">
                  Free
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
                  Opening Hour
                </p>

                <p className="text-slate-800 font-bold text-xs">
                  10:00am-11:00pm
                </p>
              </div>

            </div>

            <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-100">
              Book Now
            </button>

          </div>

          {/* ACTION ICONS */}

          <div className="flex gap-4 mt-6">

            <button
              className="p-3 bg-gray-50 rounded-full text-slate-600 hover:bg-gray-100"
            >
              <Share2 size={18} />
            </button>

            <button
              className="p-3 bg-gray-50 rounded-full text-red-500 hover:bg-red-50"
            >
              <Heart size={18} />
            </button>

            {/* RATING */}

            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="p-3 bg-gray-50 rounded-full text-yellow-500 hover:bg-yellow-50"
            >
              <Star size={18} />
            </button>

          </div>

        </div>

        {/* ========================= */}
        {/* FEATURED ITEMS */}
        {/* ========================= */}

        <section className="mt-8">

          <h2 className="text-xl font-extrabold text-gray-900 mb-5">
            Featured Items
          </h2>

          {/* HORIZONTAL ITEMS */}

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory">

            {featuredItems.map((food) => (

              <motion.div
                key={food.id}
                whileTap={{ scale: 0.98 }}
                className="min-w-[245px] snap-start bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
              >

                {/* FOOD IMAGE */}

                <div
                  onClick={() =>
                    navigate(`/food/${food.id}`, {
                      state: {
                        food: {
                          ...food,
                          restaurantId: id,
                          restaurantName: restaurant.name,
                        },
                      },
                    })
                  }
                  className="h-40 bg-orange-50 overflow-hidden cursor-pointer"
                >

                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🍕
                    </div>
                  )}

                </div>

                <div className="p-4">

                  <div className="flex justify-between items-start gap-2">

                    <h3 className="font-extrabold text-slate-800 text-[15px] line-clamp-1">
                      {food.name}
                    </h3>

                    <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                      ৳ {food.price}
                    </span>

                  </div>

                  <div className="flex items-center gap-1 mt-2">

                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-[10px] font-bold text-gray-500">
                      {food.rating || "4.5"}
                    </span>

                  </div>

                  {/* FEATURED CART BUTTON */}

                  <button
                    onClick={(event) =>
                      handleAddToCart(food, event)
                    }
                    disabled={isFoodInCart(food.id)}
                    className={`w-full mt-4 py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isFoodInCart(food.id)
                        ? "bg-green-500 text-white"
                        : "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white"
                    }`}
                  >

                    {isFoodInCart(food.id) ? (
                      <>
                        <Check size={15} strokeWidth={3} />
                        Added to Cart
                      </>
                    ) : (
                      "Add to Cart"
                    )}

                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </section>

        {/* ========================= */}
        {/* ALL MENU */}
        {/* ========================= */}

        <section className="mt-10 mb-20">

          <h2 className="text-xl font-extrabold text-gray-900 mb-5">
            All Menu
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {categories.map((category) => {

              const categoryFood = foods.find(
                (food) => food.category === category
              );

              const categoryCount = foods.filter(
                (food) => food.category === category
              ).length;

              return (
                <motion.div
                  key={category}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    navigate(
                      `/restaurants/${id}/category/${encodeURIComponent(
                        category
                      )}`
                    )
                  }
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
                >

                  <div className="h-28 bg-orange-50 overflow-hidden">

                    {categoryFood?.image ? (
                      <img
                        src={categoryFood.image}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        🍽️
                      </div>
                    )}

                  </div>

                  <div className="p-4">

                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {category}
                    </h3>

                    <p className="text-[10px] text-gray-400 mt-1">
                      {categoryCount} items
                    </p>

                  </div>

                </motion.div>
              );

            })}

          </div>

        </section>

      </div>

      {/* ================================================= */}
      {/* SEE REVIEW MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {isReviewModalOpen && (

          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-white w-full max-w-md max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl"
            >

              {/* REVIEW HEADER */}

              <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-extrabold text-slate-800">
                    Customer Reviews
                  </h3>

                  <div className="flex items-center gap-2 mt-1">

                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="font-bold text-sm">
                      {restaurant.rating || "4.5"}
                    </span>

                    <span className="text-gray-400 text-xs">
                      • 187 reviews
                    </span>

                  </div>

                </div>

                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X size={20} />
                </button>

              </div>

              {/* REVIEW LIST */}

              <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">

                {reviews.map((review) => (

                  <div
                    key={review.id}
                    className="bg-white rounded-[1.8rem] border border-gray-100 p-4 shadow-sm"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="h-11 w-11 rounded-full bg-orange-100 flex items-center justify-center font-extrabold text-orange-500">
                          {review.name.charAt(0)}
                        </div>

                        <div>

                          <h4 className="font-bold text-sm text-slate-800">
                            {review.name}
                          </h4>

                          <p className="text-[10px] text-gray-400">
                            {review.date}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-full">

                        <Star
                          size={11}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-[10px] font-bold text-yellow-600">
                          {review.rating}.0
                        </span>

                      </div>

                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed mt-3">
                      {review.text}
                    </p>

                  </div>

                ))}

              </div>

              {/* REVIEW BUTTON */}

              <div className="p-5 border-t border-gray-100">

                <button
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setIsRatingModalOpen(true);
                  }}
                  className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-yellow-100"
                >
                  <MessageSquare size={18} />
                  Write a Review
                </button>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

      {/* ================================================= */}
      {/* GIVE REVIEW MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {isRatingModalOpen && (

          <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 25 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >

              {/* HEADER */}

              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-extrabold text-slate-800">
                    Rate your experience
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    How was your experience at {restaurant.name}?
                  </p>

                </div>

                <button
                  onClick={() => setIsRatingModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="p-6">

                {/* STAR RATING */}

                <div className="text-center">

                  <p className="text-sm font-bold text-slate-700 mb-4">
                    Tap to rate
                  </p>

                  <div className="flex justify-center gap-3">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="transition-transform active:scale-90"
                      >

                        <Star
                          size={38}
                          className={
                            userRating >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }
                        />

                      </button>

                    ))}

                  </div>

                  <p className="mt-3 text-xs font-bold text-gray-400">

                    {userRating === 0
                      ? "Select a rating"
                      : userRating === 5
                      ? "Excellent!"
                      : userRating === 4
                      ? "Very Good!"
                      : userRating === 3
                      ? "Good"
                      : userRating === 2
                      ? "Could be better"
                      : "Poor"}

                  </p>

                </div>

                {/* REVIEW INPUT */}

                <div className="mt-7">

                  <label className="text-xs font-extrabold text-slate-700">
                    Your review
                  </label>

                  <textarea
                    value={reviewText}
                    onChange={(e) =>
                      setReviewText(e.target.value)
                    }
                    placeholder="Tell us about your food and delivery experience..."
                    className="w-full mt-2 h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-yellow-200 resize-none"
                  />

                  <p className="text-[10px] text-gray-400 text-right mt-1">
                    {reviewText.length}/500
                  </p>

                </div>

                {/* SUBMIT */}

                <button
                  onClick={handleSubmitReview}
                  className="w-full mt-5 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-yellow-100 active:scale-[0.98] transition"
                >
                  <Send size={17} />
                  Submit Review
                </button>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

      {/* CART ANIMATION */}

      <FlyToCartAnimation
        show={flyAnimation}
        image={flyImage}
        start={flyStart}
      />

      {/* HORIZONTAL SCROLLBAR */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }

            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />

    </div>
  );
}
