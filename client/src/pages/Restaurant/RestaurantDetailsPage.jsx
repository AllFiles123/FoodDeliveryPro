import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Star, 
  Heart, 
  Share2, 
  Check, 
  Plus, 
  MessageSquare, 
  Settings 
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("menu"); // 'menu' or 'reviews'
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
    event.stopPropagation(); // Card click protect
    const rect = event.currentTarget.getBoundingClientRect();
    setFlyImage(food.image || "");
    setFlyStart({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setFlyAnimation(true);
    setTimeout(() => setFlyAnimation(false), 1000);

    addToCart({ ...food, restaurantId: id, restaurantName: restaurant?.name });
    setAddedItems(prev => ({ ...prev, [food.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [food.id]: false })), 1500);
    showToast("Added to cart 🛒", "success");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-orange-500 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img src={restaurant.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-6 left-5 right-5 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/30 backdrop-blur-md rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
          <span className="text-white font-bold text-lg">Info</span>
          <button className="p-2 bg-white/30 backdrop-blur-md rounded-full text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-20 relative z-10">
        {/* Restaurant Info Card (Image 1 Style) */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-100">
          <h1 className="text-2xl font-bold text-slate-800">{restaurant.name}</h1>
          <p className="text-gray-400 text-xs mt-1">{restaurant.address || "Dhaka, Bangladesh"}</p>

          <div className="mt-3">
            <div className="flex items-center gap-1">
               <span className="text-slate-800 font-bold text-sm">{restaurant.rating || "4.5"}</span>
               <div className="flex text-yellow-400">
                 <Star size={14} fill="currentColor" />
               </div>
               <span className="text-gray-400 text-[11px] ml-1">(187)</span>
            </div>
            <button 
              onClick={() => setActiveTab("reviews")}
              className="text-orange-500 text-[11px] font-bold mt-1 underline"
            >
              See Review
            </button>
          </div>

          <div className="flex justify-between items-end mt-5">
            <div className="flex gap-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Delivery</p>
                <p className="text-slate-800 font-bold text-xs">Free</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Opening Hour</p>
                <p className="text-slate-800 font-bold text-xs">10:00am-11:00pm</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-100">
              Book Now
            </button>
          </div>

          {/* Action Icons: Share, Favorite, Rate */}
          <div className="flex gap-4 mt-6">
            <button className="p-3 bg-gray-50 rounded-full text-slate-600 hover:bg-gray-100"><Share2 size={18}/></button>
            <button className="p-3 bg-gray-50 rounded-full text-red-500 hover:bg-red-50"><Heart size={18}/></button>
            <button onClick={() => setIsRatingModalOpen(true)} className="p-3 bg-gray-50 rounded-full text-yellow-500 hover:bg-yellow-50"><Star size={18}/></button>
          </div>
        </div>

        {/* Tab Switcher (Image 2 Style) */}
        <div className="mt-8 flex gap-4 p-1 bg-gray-50 rounded-2xl">
            <button 
                onClick={() => setActiveTab("menu")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${activeTab === 'menu' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400'}`}
            >
                All Menus
            </button>
            <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${activeTab === 'reviews' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-400'}`}
            >
                Completed Reviews
            </button>
        </div>

        {/* Dynamic Content */}
        <div className="mt-6 mb-20 space-y-4">
          {activeTab === "menu" ? (
            foods.map((food) => (
              <motion.div 
                key={food.id} 
                onClick={() => navigate(`/restaurants/${id}/category/${food.category || 'Food'}`)}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer relative"
              >
                <div className="w-20 h-20 bg-orange-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={food.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-slate-800 text-[15px]">{food.name}</h3>
                    <p className="font-bold text-slate-800 text-sm">${food.price}</p>
                  </div>
                  <p className="text-gray-400 text-[10px] mt-1">{restaurant.name}</p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-lg">
                        {food.category || 'Special'}
                    </span>
                    <button 
                      onClick={(e) => handleAddToCart(food, e)}
                      className="bg-green-50 text-green-600 text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-green-600 hover:text-white transition-colors"
                    >
                      {addedItems[food.id] ? <Check size={14} /> : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Review Section (Image 2 Style)
            [1, 2, 3].map((rev) => (
              <div key={rev} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                    <MessageSquare size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <h4 className="font-bold text-slate-800 text-sm">Reviewer Name</h4>
                        <div className="flex text-yellow-400 gap-0.5">
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                        </div>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-1 leading-relaxed">The food was really delicious and the delivery was fast. Highly recommended!</p>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-[9px] text-gray-300">Delivered on 12 Aug, 10:45 AM</span>
                        <span className="text-orange-400 bg-orange-50 px-3 py-1 rounded-full text-[9px] font-bold">Verified</span>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {isRatingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-center">Give Rating</h3>
              <div className="flex justify-center gap-2 my-8">
                {[1,2,3,4,5].map((star) => (
                  <Star 
                    key={star} 
                    size={35} 
                    onClick={() => setUserRating(star)}
                    className={`cursor-pointer transition ${userRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <textarea placeholder="Write review..." className="w-full bg-gray-50 rounded-2xl p-4 text-sm h-28 outline-none" />
              <button onClick={() => setIsRatingModalOpen(false)} className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl mt-6">Submit</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FlyToCartAnimation show={flyAnimation} image={flyImage} start={flyStart} />
    </div>
  );
}
