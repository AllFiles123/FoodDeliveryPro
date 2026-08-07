import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import restaurantService from "../../services/restaurantService";
import FoodCard from "./components/FoodCard"; 

export default function CategoryFoodsPage() {
  const { id, categoryName } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryFoods = async () => {
      try {
        const res = await restaurantService.getFoodsByRestaurantId(id);
        const filtered = res.foods.filter(f => f.category === categoryName);
        setFoods(filtered);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCategoryFoods();
  }, [id, categoryName]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-5 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white shadow-sm rounded-2xl">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">{categoryName}</h1>
      </div>

      {loading ? (
        <div className="text-center mt-20 text-orange-500 font-bold italic">Filtering {categoryName}...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {foods.length > 0 ? foods.map(food => (
            <FoodCard key={food.id} food={food} onAdd={() => {}} />
          )) : (
            <div className="text-center col-span-2 mt-20 text-gray-400">No {categoryName} found.</div>
          )}
        </div>
      )}
    </div>
  );
}
