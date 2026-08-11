import {
  getDatabase,
  saveDatabase,
} from "../database/database.js";

export function createSearchTable() {
  const db = getDatabase();

  db.run(`
    CREATE TABLE IF NOT EXISTS search_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      query TEXT NOT NULL,
      restaurantId INTEGER,
      foodId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDatabase();
}

export function createSearchLog(data) {
  const db = getDatabase();

  const query = String(data.query || "").trim();

  if (!query) return;

  const statement = db.prepare(`
    INSERT INTO search_logs
    (
      userId,
      query,
      restaurantId,
      foodId
    )
    VALUES (?, ?, ?, ?)
  `);

  statement.run([
    data.userId || null,
    query,
    data.restaurantId || null,
    data.foodId || null,
  ]);

  statement.free();

  saveDatabase();
}

export function searchRestaurantsAndFoods(query, limit = 30) {
  const db = getDatabase();

  const search = String(query || "").trim();

  if (!search) {
    return {
      restaurants: [],
      foods: [],
    };
  }

  const safeQuery = search
    .replace(/[%_]/g, "\\$&")
    .replace(/'/g, "''");

  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 30, 100)
  );

  const restaurantResult = db.exec(`
    SELECT *
    FROM restaurants
    WHERE
      LOWER(name) LIKE LOWER('%${safeQuery}%')
      OR LOWER(description) LIKE LOWER('%${safeQuery}%')
      OR LOWER(category) LIKE LOWER('%${safeQuery}%')
      OR LOWER(location) LIKE LOWER('%${safeQuery}%')
    ORDER BY
      CASE
        WHEN LOWER(name) = LOWER('${safeQuery}')
        THEN 0
        ELSE 1
      END,
      rating DESC,
      id DESC
    LIMIT ${safeLimit}
  `);

  const foodResult = db.exec(`
    SELECT
      f.*,
      r.name AS restaurantName
    FROM foods f
    LEFT JOIN restaurants r
      ON r.id = f.restaurantId
    WHERE
      LOWER(f.name) LIKE LOWER('%${safeQuery}%')
      OR LOWER(f.description) LIKE LOWER('%${safeQuery}%')
      OR LOWER(f.category) LIKE LOWER('%${safeQuery}%')
    ORDER BY
      CASE
        WHEN LOWER(f.name) = LOWER('${safeQuery}')
        THEN 0
        ELSE 1
      END,
      f.rating DESC,
      f.id DESC
    LIMIT ${safeLimit}
  `);

  const mapResult = (result) => {
    if (!result.length) return [];

    return result[0].values.map((row) => {
      const item = {};

      result[0].columns.forEach(
        (column, index) => {
          item[column] = row[index];
        }
      );

      return item;
    });
  };

  return {
    restaurants: mapResult(restaurantResult),
    foods: mapResult(foodResult),
  };
}

export function getTopSearchFoodsByRestaurantId(
  restaurantId,
  limit = 6
) {
  const db = getDatabase();

  const safeRestaurantId = Number(restaurantId);
  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 6, 50)
  );

  if (!Number.isFinite(safeRestaurantId)) {
    return [];
  }

  const result = db.exec(`
    SELECT
      f.*,
      COUNT(s.id) AS searchCount
    FROM foods f
    INNER JOIN search_logs s
      ON (
        s.foodId = f.id
        OR (
          s.foodId IS NULL
          AND LOWER(s.query) = LOWER(f.name)
        )
      )
    WHERE f.restaurantId = ${safeRestaurantId}
    GROUP BY f.id
    ORDER BY searchCount DESC, f.id DESC
    LIMIT ${safeLimit}
  `);

  if (!result.length) {
    return [];
  }

  return result[0].values.map((row) => {
    const item = {};

    result[0].columns.forEach(
      (column, index) => {
        item[column] = row[index];
      }
    );

    return item;
  });
}
