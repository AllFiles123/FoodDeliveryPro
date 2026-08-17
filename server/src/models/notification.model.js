import { query } from "../database/postgres.js";


export async function createNotificationTable() {

  await query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL,
      title TEXT NOT NULL,
      message TEXT DEFAULT '',
      type TEXT DEFAULT 'general',
      "isRead" BOOLEAN DEFAULT FALSE,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

}


export async function getNotificationsByUser(userId) {

  const result = await query(
    `
    SELECT *
    FROM user_notifications
    WHERE "userId" = $1
    ORDER BY id DESC
    `,
    [userId]
  );

  return result.rows;

}


export async function markNotificationRead(id, userId) {

  const result = await query(
    `
    UPDATE user_notifications
    SET "isRead" = TRUE
    WHERE id = $1
      AND "userId" = $2
    RETURNING *
    `,
    [id, userId]
  );

  return result.rows[0] || null;

}
