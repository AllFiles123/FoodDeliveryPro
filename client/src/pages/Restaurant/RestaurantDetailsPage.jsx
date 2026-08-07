import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Share2, 
  Star, 
  Clock, 
  MapPin, 
  Check, 
  Plus,
  Info
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
  
  // Animation States
  const [flyAnimation, setFlyAnimation] = useState(false);
  const [flyImage, setFlyImage] = useState("");
  const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });
  
  // Track which items show the checkmark icon
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const restaurantResponse = await restaurantService.getRestaurantById(id);
        const foodResponse = await restaurantService.getFoodsByRestaurantId(id);
        setRestaurant(restaurantResponse.restaurant);
        setFoods(foodResponse.foods || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddToCart = (food, event) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setFlyImage(food.image || "");
      setFlyStart({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
      setFlyAnimation(true);
      setTimeout(() => setFlyAnimation(false), 1000);
    }

    // Add to cart logic
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image || "",
      description: food.description,
      rating: food.rating,
      restaurantId: id,
      restaurantName: restaurant?.name
    });

    // Show checkmark icon temporarily
    setAddedItems(prev => ({ ...prev, [food.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [food.id]: false }));
    }, 1500);

    showToast("Added to cart 🛒", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-orange-500 text-xl font-semibold"
        >
          Loading Restaurant...
        </motion.p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-slate-800">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10">
      {/* Header Image Section */}
      <div className="relative h-72 w-full">
        <img
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
          alt={restaurant.name}
          className="w-full h-full object-cover shadow-inner"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Top Buttons */}
        <div className="absolute top-6 left-5 right-5 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-white font-semibold text-lg">Info</h3>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 -mt-20 relative z-10">
        
        {/* Restaurant Card (Image 1 Style) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{restaurant.name}</h1>
              <p className="text-gray-400 text-xs mt-1 leading-tight max-w-[200px]">
                {restaurant.address || "Dhanmondi 27 No Road, House No - 45 Block -D Floor No 8th, Dhaka, Bangladesh"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3">
            <span className="text-slate-800 font-bold text-sm">{restaurant.rating || "4.5"}</span>
            <div className="flex text-yellow-400 scale-90">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-400 text-[10px] ml-1">(187)</span>
          </div>

          <div className="flex justify-between items-end mt-5">
            <div className="flex gap-6">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Delivery</p>
                <p className="text-slate-800 font-bold text-xs mt-0.5">Free</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Opening Hour</p>
                <p className="text-slate-800 font-bold text-xs mt-0.5">10:00am-11:00pm</p>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-7 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 active:scale-95 transition-transform">
              Book Now
            </button>
          </div>

          {/* Social Icons Style Buttons (Like Image 1) */}
          <div className="flex gap-3 mt-6">
             <button className="p-2.5 bg-gray-100 rounded-full text-slate-600"><Share2 size={16}/></button>
             <button className="p-2.5 bg-gray-100 rounded-full text-slate-600"><Star size={16}/></button>
             <button className="p-2.5 bg-gray-100 rounded-full text-slate-600"><Info size={16}/></button>
          </div>
        </motion.div>

        {/* Featured Items (Horizontal Scroll) */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Featured Items</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {foods.map((food) => (
              <motion.div 
                key={food.id}
                className="min-w-[170px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 p-2"
              >
                <div className="relative">
                  <img src={food.image} className="h-28 w-full object-cover rounded-xl" alt="" />
                  {/* Green Add Button */}
                  <button 
                    onClick={(e) => handleAddToCart(food, e)}
                    className="absolute -bottom-2 -right-1 bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 active:scale-90 transition-all"
                  >
                    {addedItems[food.id] ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                  </button>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="text-[13px] font-bold text-slate-800 truncate">{food.name}</h3>
                  <p className="text-orange-500 font-bold text-sm mt-0.5">${food.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Menus Section (Vertical List) */}
        <div className="mt-6 mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">All Menus</h2>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <span>Thai Cuisine (3)</span>
              <ChevronLeft size={14} className="rotate-270" />
            </div>
          </div>

          <div className="grid gap-4">
            {foods.map((food) => (
              <motion.div 
                key={food.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 items-center relative"
              >
                <img src={food.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">{food.name}</h3>
                  <p className="text-orange-500 font-bold text-sm mt-1">${food.price}</p>
                  <p className="text-gray-400 text-[10px] mt-1 leading-tight line-clamp-2">
                    {food.description || "2 Pcs Salmon, 2 pcs california, 1 pcs alvacore, 2 pcs tuna"}
                  </p>
                </div>
                
                {/* Green Add Button on Vertical List */}
                <button 
                  onClick={(e) => handleAddToCart(food, e)}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-90 shadow-lg ${
                    addedItems[food.id] ? 'bg-green-500 shadow-green-200' : 'bg-green-600 shadow-green-100'
                  }`}
                >
                  {addedItems[food.id] ? (
                    <Check size={20} className="text-white" strokeWidth={3} />
                  ) : (
                    <Plus size={20} className="text-white" strokeWidth={3} />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Animation Component */}
      <FlyToCartAnimation
        show={flyAnimation}
        image={flyImage}
        start={flyStart}
      />

      {/* Custom Styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
