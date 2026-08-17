import { query } from "../database/postgres.js";

export async function getBestSellingFoodsByRestaurantId(
  restaurantId,
  limit = 6
) {
  const safeRestaurantId = Number(restaurantId);
  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 6, 50)
  );

  if (!Number.isFinite(safeRestaurantId)) {
    return [];
  }

  const ordersResult = await query(`
    SELECT items
    FROM orders
    WHERE items IS NOT NULL
  `);

  const salesMap = new Map();

  for (const row of ordersResult.rows) {
    let items = [];

    try {
      items = JSON.parse(row.items || "[]");
    } catch {
      items = [];
    }

    if (!Array.isArray(items)) continue;

    for (const item of items) {
      const itemRestaurantId =
        item.restaurantId ??
        item.restaurant_id;

      if (
        itemRestaurantId === undefined ||
        itemRestaurantId === null ||
        String(itemRestaurantId) !== String(safeRestaurantId)
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

      const key = String(foodId);

      salesMap.set(
        key,
        (salesMap.get(key) || 0) + quantity
      );
    }
  }

  if (!salesMap.size) {
    return [];
  }

  const foodIds = [...salesMap.keys()]
    .map(Number)
    .filter(Number.isFinite);

  if (!foodIds.length) {
    return [];
  }

  const result = await query(
    `
    SELECT *
    FROM foods
    WHERE "restaurantId" = $1
      AND id = ANY($2::bigint[])
    `,
    [
      safeRestaurantId,
      foodIds,
    ]
  );

  return result.rows
    .map((food) => ({
      ...food,
      soldCount:
        salesMap.get(String(food.id)) || 0,
    }))
    .sort(
      (a, b) =>
        Number(b.soldCount) -
        Number(a.soldCount)
    )
    .slice(0, safeLimit);
}
