import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Heart, Check, X, Plus } from "lucide-react";

import restaurantService from "../../services/restaurantService";
import FlyToCartAnimation from "../../components/animations/FlyToCartAnimation";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const [flyAnimation, setFlyAnimation] = useState(false);
  const [flyImage, setFlyImage] = useState("");
  const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await restaurantService.getRestaurantById(id);
        const foodRes = await restaurantService.getFoodsByRestaurantId(id);
        setRestaurant(res.restaurant);
        setFoods(foodRes.foods || []);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    loadData();
  }, [id]);

  const handleAddToCart = (food, event) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setFlyImage(food.image || "");
      setFlyStart({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setFlyAnimation(true);
      setTimeout(() => setFlyAnimation(false), 1000);
    }
    addToCart({ 
        id: food.id, 
        name: food.name, 
        price: food.price, 
        image: food.image, 
        restaurantId: id, 
        restaurantName: restaurant?.name 
    });
    setAddedItems(prev => ({ ...prev, [food.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [food.id]: false })), 1500);
    showToast("Added to cart 🛒", "success");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-orange-500 font-bold">Loading Restaurant...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10">
      {/* Header Image Section */}
      <div className="relative h-72 w-full">
        <img src={restaurant.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-6 left-5">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-20 relative z-10">
        {/* Restaurant Detail Card */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50">
          <h1 className="text-2xl font-bold text-slate-800">{restaurant.name}</h1>
          <p className="text-gray-400 text-xs mt-1">{restaurant.address || "Dhaka, Bangladesh"}</p>

          {/* Rating Section - Clickable */}
          <div onClick={() => setIsRatingModalOpen(true)} className="flex items-center gap-1 mt-3 cursor-pointer">
            <span className="text-slate-800 font-bold text-sm">{restaurant.rating || "4.5"}</span>
            <div className="flex text-yellow-400">
              <Star size={14} fill="currentColor" />
            </div>
            <span className="text-gray-400 text-[10px] ml-1">(Give Rating)</span>
          </div>

          <div className="flex justify-between items-end mt-5">
            <div className="flex gap-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Delivery</p>
                <p className="text-slate-800 font-bold text-xs">Free</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Opening Hour</p>
                <p className="text-slate-800 font-bold text-xs">10:00am-11:00pm</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-100">
              Book Now
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="p-2.5 bg-gray-100 rounded-full text-red-500 hover:bg-red-50 transition">
                <Heart size={18} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Featured Items Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Featured Items</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {foods.map((food) => (
              <div key={food.id} className="min-w-[180px] bg-white rounded-2xl p-2 shadow-sm border border-gray-50">
                <img src={food.image} className="h-28 w-full object-cover rounded-xl" alt="" />
                <div className="mt-3 px-1">
                  <h3 className="text-[13px] font-bold text-slate-800 truncate">{food.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-orange-500 font-bold text-sm">${food.price}</span>
                    {/* Add to Cart Button with Text */}
                    <button 
                      onClick={(e) => handleAddToCart(food, e)}
                      className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                        addedItems[food.id] ? 'bg-green-500 text-white' : 'bg-green-600 text-white shadow-md shadow-green-100'
                      }`}
                    >
                      {addedItems[food.id] ? <Check size={12} strokeWidth={3} /> : <><Plus size={10} /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Menus Section (Navigate to Category) */}
        <div className="mt-6 mb-24">
          <h2 className="text-lg font-bold text-slate-800 mb-4">All Menus</h2>
          <div className="grid gap-4">
            {foods.map((food) => (
              <div 
                key={food.id} 
                onClick={() => navigate(`/restaurant/${id}/category/${food.category || 'Special'}`)}
                className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 items-center cursor-pointer active:scale-95 transition"
              >
                <img src={food.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">{food.name}</h3>
                  <p className="text-gray-400 text-[10px] mt-1">Tap to see all {food.category || 'items'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-full">
                    <ChevronLeft size={16} className="text-gray-400 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {isRatingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRatingModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 shadow-2xl">
              <h3 className="text-xl font-bold text-center text-slate-800">Rate Your Experience</h3>
              <div className="flex justify-center gap-2 my-8">
                {[1,2,3,4,5].map((star) => (
                  <Star 
                    key={star} 
                    size={35} 
                    onClick={() => setUserRating(star)}
                    className={`cursor-pointer transition-all ${userRating >= star ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <textarea placeholder="Tell us about the food..." className="w-full bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 ring-orange-500 h-28 outline-none resize-none" />
              <button onClick={() => setIsRatingModalOpen(false)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl mt-6 shadow-lg shadow-orange-200 active:scale-95 transition">
                Submit Review
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FlyToCartAnimation show={flyAnimation} image={flyImage} start={flyStart} />
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

