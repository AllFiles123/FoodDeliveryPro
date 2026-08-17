import { query } from "../database/postgres.js";

export async function createRestaurantTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      description TEXT,
      category TEXT,
      rating NUMERIC DEFAULT 0,
      "deliveryTime" TEXT,
      location TEXT,
      "openingTime" TEXT DEFAULT '10:00',
      "closingTime" TEXT DEFAULT '23:00',
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function createRestaurant(data) {
  const result = await query(
    `
    INSERT INTO restaurants
    (
      name,
      image,
      description,
      category,
      rating,
      "deliveryTime",
      location,
      "openingTime",
      "closingTime"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      data.name,
      data.image || "",
      data.description || "",
      data.category || "",
      data.rating || 0,
      data.deliveryTime || "",
      data.location || "",
      data.openingTime || "10:00",
      data.closingTime || "23:00",
    ]
  );

  return result.rows[0];
}

export async function getRestaurants() {
  const result = await query(`
    SELECT *
    FROM restaurants
    ORDER BY id DESC
  `);

  return result.rows;
}

export async function getRestaurantById(id) {
  const result = await query(
    `
    SELECT *
    FROM restaurants
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

