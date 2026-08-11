import { getDatabase } from "../database/database.js";

export function getBestSellingFoodsByRestaurantId(
  restaurantId,
  limit = 6
) {
  const db = getDatabase();

  const ordersResult = db.exec(`
    SELECT items
    FROM orders
    WHERE items IS NOT NULL
  `);

  if (!ordersResult.length) {
    return [];
  }

  const salesMap = new Map();

  for (const row of ordersResult[0].values) {
    const rawItems = row[0];

    let items = [];

    try {
      items = JSON.parse(rawItems || "[]");
    } catch {
      items = [];
    }

    if (!Array.isArray(items)) continue;

    for (const item of items) {
      const itemRestaurantId =
        item.restaurantId ??
        item.restaurant_id;

      if (
        String(itemRestaurantId) !==
        String(restaurantId)
      ) {
        continue;
      }

      const foodId =
        item.id ??
        item.foodId ??
        item.food_id;

      if (
        foodId === undefined ||
        foodId === null
      ) {
        continue;
      }

      const quantity =
        Number(item.quantity) || 1;

      const current =
        salesMap.get(String(foodId)) || 0;

      salesMap.set(
        String(foodId),
        current + quantity
      );
    }
  }

  if (!salesMap.size) {
    return [];
  }

  const foodIds = [...salesMap.keys()]
    .map((id) => Number(id))
    .filter(Number.isFinite);

  if (!foodIds.length) {
    return [];
  }

  const result = db.exec(`
    SELECT *
    FROM foods
    WHERE restaurantId = ${Number(restaurantId)}
      AND id IN (${foodIds.join(",")})
  `);

  if (!result.length) {
    return [];
  }

  return result[0].values
    .map((row) => {
      const food = {};

      result[0].columns.forEach(
        (column, index) => {
          food[column] = row[index];
        }
      );

      food.soldCount =
        salesMap.get(String(food.id)) || 0;

      return food;
    })
    .sort(
      (a, b) =>
        b.soldCount - a.soldCount
    )
    .slice(0, Number(limit));
}
