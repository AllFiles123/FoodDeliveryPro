import { query } from "../database/postgres.js";


export async function createAddressTable() {

  await query(`
    CREATE TABLE IF NOT EXISTS user_addresses (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL,
      label TEXT DEFAULT 'Home',
      address TEXT NOT NULL,
      city TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      "isDefault" BOOLEAN DEFAULT FALSE,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

}


export async function getAddressesByUser(userId) {

  const result = await query(
    `
    SELECT *
    FROM user_addresses
    WHERE "userId" = $1
    ORDER BY "isDefault" DESC, id DESC
    `,
    [userId]
  );

  return result.rows;

}


export async function createAddress({
  userId,
  label,
  address,
  city,
  phone,
  isDefault,
}) {

  const result = await query(
    `
    INSERT INTO user_addresses
    (
      "userId",
      label,
      address,
      city,
      phone,
      "isDefault"
    )
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      userId,
      label || "Home",
      address,
      city || "",
      phone || "",
      Boolean(isDefault),
    ]
  );

  return result.rows[0];

}


export async function deleteAddress(id, userId) {

  const result = await query(
    `
    DELETE FROM user_addresses
    WHERE id = $1
      AND "userId" = $2
    RETURNING *
    `,
    [id, userId]
  );

  return result.rows[0] || null;

}
