import { query } from "../database/postgres.js";

export async function createFoodTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS foods (
      id BIGSERIAL PRIMARY KEY,
      "restaurantId" BIGINT NOT NULL,
      name TEXT NOT NULL,
      image TEXT,
      description TEXT,
      category TEXT,
      price NUMERIC NOT NULL,
      rating NUMERIC DEFAULT 0,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function createFood(data) {
  const result = await query(
    `
    INSERT INTO foods
    (
      "restaurantId",
      name,
      image,
      description,
      category,
      price,
      rating
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      data.restaurantId,
      data.name,
      data.image || "",
      data.description || "",
      data.category || "",
      data.price,
      data.rating || 0,
    ]
  );

  return result.rows[0];
}

export async function getFoodsByRestaurantId(restaurantId) {
  const result = await query(
    `
    SELECT *
    FROM foods
    WHERE "restaurantId" = $1
    ORDER BY id DESC
    `,
    [restaurantId]
  );

  return result.rows;
}

export async function getFoodById(id) {
  const result = await query(
    `
    SELECT *
    FROM foods
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}
