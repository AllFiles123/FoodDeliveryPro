import { query } from "../database/postgres.js";

export async function createSearchTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS search_logs (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT,
      query TEXT NOT NULL,
      "restaurantId" BIGINT,
      "foodId" BIGINT,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function createSearchLog(data = {}) {
  const searchQuery = String(data.query || "").trim();

  if (!searchQuery) {
    return null;
  }

  const userId =
    data.userId !== undefined &&
    data.userId !== null &&
    String(data.userId).trim() !== ""
      ? String(data.userId)
      : null;

  const restaurantId =
    data.restaurantId !== undefined &&
    data.restaurantId !== null &&
    String(data.restaurantId).trim() !== ""
      ? String(data.restaurantId)
      : null;

  const foodId =
    data.foodId !== undefined &&
    data.foodId !== null &&
    String(data.foodId).trim() !== ""
      ? String(data.foodId)
      : null;

  const result = await query(
    `
    INSERT INTO search_logs
    (
      "userId",
      query,
      "restaurantId",
      "foodId"
    )
    VALUES
    ($1::BIGINT, $2, $3::BIGINT, $4::BIGINT)
    RETURNING id
    `,
    [
      userId,
      searchQuery,
      restaurantId,
      foodId,
    ]
  );

  return result.rows[0] || null;
}

export async function searchRestaurantsAndFoods(
  searchText,
  limit = 30
) {
  const search = String(searchText || "").trim();

  if (!search) {
    return {
      restaurants: [],
      foods: [],
    };
  }

  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 30, 100)
  );

  const pattern = `%${search}%`;

  const restaurantResult = await query(
    `
    SELECT *
    FROM restaurants
    WHERE
      LOWER(name) LIKE LOWER($1)
      OR LOWER(description) LIKE LOWER($1)
      OR LOWER(category) LIKE LOWER($1)
      OR LOWER(location) LIKE LOWER($1)
    ORDER BY
      CASE
        WHEN LOWER(name) = LOWER($2)
        THEN 0
        ELSE 1
      END,
      rating DESC NULLS LAST,
      id DESC
    LIMIT $3::INTEGER
    `,
    [
      pattern,
      search,
      safeLimit,
    ]
  );

  const foodResult = await query(
    `
    SELECT
      f.*,
      r.name AS "restaurantName"
    FROM foods f
    LEFT JOIN restaurants r
      ON r.id = f."restaurantId"
    WHERE
      LOWER(f.name) LIKE LOWER($1)
      OR LOWER(f.description) LIKE LOWER($1)
      OR LOWER(f.category) LIKE LOWER($1)
    ORDER BY
      CASE
        WHEN LOWER(f.name) = LOWER($2)
        THEN 0
        ELSE 1
      END,
      f.rating DESC NULLS LAST,
      f.id DESC
    LIMIT $3::INTEGER
    `,
    [
      pattern,
      search,
      safeLimit,
    ]
  );

  return {
    restaurants: restaurantResult.rows,
    foods: foodResult.rows,
  };
}


export async function getGlobalTopSearchQueries(limit = 10) {
  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 10, 50)
  );

  const result = await query(
    `
    SELECT
      LOWER(TRIM(query)) AS query,
      COUNT(*)::INTEGER AS "searchCount"
    FROM search_logs
    WHERE TRIM(query) <> ''
    GROUP BY LOWER(TRIM(query))
    ORDER BY
      "searchCount" DESC,
      query ASC
    LIMIT $1
    `,
    [safeLimit]
  );

  return result.rows;
}

export async function getTopSearchFoodsByRestaurantId(
  restaurantId,
  limit = 6
) {
  const safeRestaurantId = String(
    restaurantId ?? ""
  ).trim();

  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 6, 50)
  );

  if (!/^\d+$/.test(safeRestaurantId)) {
    return [];
  }

  const result = await query(
    `
    SELECT
      f.*,
      COUNT(s.id)::INTEGER AS "searchCount"
    FROM foods f
    INNER JOIN search_logs s
      ON
      (
        s."foodId" = f.id
        OR
        (
          s."foodId" IS NULL
          AND LOWER(TRIM(s.query)) = LOWER(TRIM(f.name))
        )
      )
    WHERE f."restaurantId" = $1::BIGINT
    GROUP BY f.id
    ORDER BY
      "searchCount" DESC,
      f.id DESC
    LIMIT $2::INTEGER
    `,
    [
      safeRestaurantId,
      safeLimit,
    ]
  );

  return result.rows;
}

export async function getGlobalTopSearchFoods(limit = 10) {
  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 10, 50)
  );

  const result = await query(
    `
    SELECT
      f.*,
      r.name AS "restaurantName",
      COUNT(s.id)::INTEGER AS "searchCount"
    FROM foods f
    LEFT JOIN restaurants r
      ON r.id = f."restaurantId"
    INNER JOIN search_logs s
      ON (
        s."foodId" = f.id
        OR (
          s."foodId" IS NULL
          AND LOWER(TRIM(s.query)) = LOWER(TRIM(f.name))
        )
      )
    GROUP BY
      f.id,
      r.name
    ORDER BY
      "searchCount" DESC,
      f.rating DESC,
      f.id DESC
    LIMIT $1
    `,
    [safeLimit]
  );

  return result.rows;
}
