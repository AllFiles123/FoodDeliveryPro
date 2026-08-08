import { createContext, useContext, useEffect, useState } from "react";

const FavouriteContext = createContext();

const STORAGE_KEY = "foodDeliveryProFavourites";

export function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : { items: [], restaurants: [] };
    } catch {
      return { items: [], restaurants: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favourites)
    );
  }, [favourites]);

  const isItemFavourite = (id) =>
    favourites.items.some(
      (item) => String(item.id) === String(id)
    );

  const isRestaurantFavourite = (id) =>
    favourites.restaurants.some(
      (restaurant) =>
        String(restaurant.id) === String(id)
    );

  const toggleItemFavourite = (food) => {
    if (!food?.id) return;

    setFavourites((prev) => {
      const exists = prev.items.some(
        (item) =>
          String(item.id) === String(food.id)
      );

      return {
        ...prev,
        items: exists
          ? prev.items.filter(
              (item) =>
                String(item.id) !== String(food.id)
            )
          : [...prev.items, food],
      };
    });
  };

  const toggleRestaurantFavourite = (restaurant) => {
    if (!restaurant?.id) return;

    setFavourites((prev) => {
      const exists = prev.restaurants.some(
        (item) =>
          String(item.id) === String(restaurant.id)
      );

      return {
        ...prev,
        restaurants: exists
          ? prev.restaurants.filter(
              (item) =>
                String(item.id) !==
                String(restaurant.id)
            )
          : [...prev.restaurants, restaurant],
      };
    });
  };

  const removeItemFavourite = (id) => {
    setFavourites((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) =>
          String(item.id) !== String(id)
      ),
    }));
  };

  const removeRestaurantFavourite = (id) => {
    setFavourites((prev) => ({
      ...prev,
      restaurants: prev.restaurants.filter(
        (item) =>
          String(item.id) !== String(id)
      ),
    }));
  };

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        isItemFavourite,
        isRestaurantFavourite,
        toggleItemFavourite,
        toggleRestaurantFavourite,
        removeItemFavourite,
        removeRestaurantFavourite,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

export function useFavourite() {
  return useContext(FavouriteContext);
}
