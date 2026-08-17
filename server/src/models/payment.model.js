import { query } from "../database/postgres.js";


export async function createPaymentTable() {

  await query(`
    CREATE TABLE IF NOT EXISTS user_payment_methods (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL,
      type TEXT DEFAULT 'card',
      "cardHolder" TEXT DEFAULT '',
      "lastFour" TEXT DEFAULT '',
      brand TEXT DEFAULT '',
      "isDefault" BOOLEAN DEFAULT FALSE,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

}


export async function getPaymentMethodsByUser(userId) {

  const result = await query(
    `
    SELECT
      id,
      "userId",
      type,
      "cardHolder",
      "lastFour",
      brand,
      "isDefault",
      "createdAt"
    FROM user_payment_methods
    WHERE "userId" = $1
    ORDER BY "isDefault" DESC, id DESC
    `,
    [userId]
  );

  return result.rows;

}


export async function createPaymentMethod({
  userId,
  type,
  cardHolder,
  lastFour,
  brand,
  isDefault,
}) {

  const result = await query(
    `
    INSERT INTO user_payment_methods
    (
      "userId",
      type,
      "cardHolder",
      "lastFour",
      brand,
      "isDefault"
    )
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      userId,
      type || "card",
      cardHolder || "",
      lastFour || "",
      brand || "",
      Boolean(isDefault),
    ]
  );

  return result.rows[0];

}


export async function deletePaymentMethod(id, userId) {

  const result = await query(
    `
    DELETE FROM user_payment_methods
    WHERE id = $1
      AND "userId" = $2
    RETURNING *
    `,
    [id, userId]
  );

  return result.rows[0] || null;

}
