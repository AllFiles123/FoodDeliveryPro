import { query } from "../database/postgres.js";

export async function createProfileDataTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      "userId" BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      "profileImage" TEXT DEFAULT '',
      theme TEXT DEFAULT 'light',
      language TEXT DEFAULT 'English',
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_addresses (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT '',
      address TEXT NOT NULL,
      "isDefault" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_payment_methods (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      label TEXT DEFAULT '',
      "lastFour" TEXT DEFAULT '',
      "isDefault" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT '',
      message TEXT DEFAULT '',
      "isRead" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_favourites (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "itemType" TEXT NOT NULL,
      "itemId" TEXT NOT NULL,
      data JSONB DEFAULT '{}'::jsonb,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE ("userId", "itemType", "itemId")
    )
  `);
}

export async function getFullProfile(userId) {
  await query(
    `INSERT INTO user_profiles ("userId")
     VALUES ($1)
     ON CONFLICT ("userId") DO NOTHING`,
    [userId]
  );

  const userResult = await query(
    `SELECT id, "fullName", email, phone, role, "createdAt", "updatedAt"
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const profileResult = await query(
    `SELECT "profileImage", theme, language
     FROM user_profiles
     WHERE "userId" = $1`,
    [userId]
  );

  const addresses = await query(
    `SELECT id, title, address, "isDefault", "createdAt"
     FROM user_addresses
     WHERE "userId" = $1
     ORDER BY "isDefault" DESC, id DESC`,
    [userId]
  );

  const payments = await query(
    `SELECT id, type, label, "lastFour", "isDefault", "createdAt"
     FROM user_payment_methods
     WHERE "userId" = $1
     ORDER BY "isDefault" DESC, id DESC`,
    [userId]
  );

  const notifications = await query(
    `SELECT id, title, message, "isRead", "createdAt"
     FROM user_notifications
     WHERE "userId" = $1
     ORDER BY id DESC`,
    [userId]
  );

  const favourites = await query(
    `SELECT id, "itemType", "itemId", data, "createdAt"
     FROM user_favourites
     WHERE "userId" = $1
     ORDER BY id DESC`,
    [userId]
  );

  return {
    user: userResult.rows[0] || null,
    profile: profileResult.rows[0] || {
      profileImage: "",
      theme: "light",
      language: "English"
    },
    addresses: addresses.rows,
    paymentMethods: payments.rows,
    notifications: notifications.rows,
    favourites: favourites.rows
  };
}

export async function updateProfileData(userId, data = {}) {
  await query(
    `INSERT INTO user_profiles
      ("userId", "profileImage", theme, language)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT ("userId")
     DO UPDATE SET
       "profileImage" = COALESCE(EXCLUDED."profileImage", user_profiles."profileImage"),
       theme = COALESCE(EXCLUDED.theme, user_profiles.theme),
       language = COALESCE(EXCLUDED.language, user_profiles.language),
       "updatedAt" = CURRENT_TIMESTAMP`,
    [
      userId,
      data.profileImage ?? "",
      data.theme ?? "light",
      data.language ?? "English"
    ]
  );

  if (data.fullName !== undefined || data.phone !== undefined) {
    await query(
      `UPDATE users
       SET
         "fullName" = COALESCE($1, "fullName"),
         phone = COALESCE($2, phone),
         "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [
        data.fullName ?? null,
        data.phone ?? null,
        userId
      ]
    );
  }

  return getFullProfile(userId);
}

export async function replaceAddresses(userId, addresses = []) {
  await query(`DELETE FROM user_addresses WHERE "userId" = $1`, [userId]);

  for (const item of addresses) {
    if (!item?.address) continue;

    await query(
      `INSERT INTO user_addresses
        ("userId", title, address, "isDefault")
       VALUES ($1, $2, $3, $4)`,
      [
        userId,
        item.title || "",
        item.address,
        Boolean(item.isDefault)
      ]
    );
  }

  return getFullProfile(userId);
}

export async function replacePaymentMethods(userId, methods = []) {
  await query(
    `DELETE FROM user_payment_methods WHERE "userId" = $1`,
    [userId]
  );

  for (const item of methods) {
    if (!item?.type) continue;

    await query(
      `INSERT INTO user_payment_methods
        ("userId", type, label, "lastFour", "isDefault")
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        item.type,
        item.label || "",
        item.lastFour || "",
        Boolean(item.isDefault)
      ]
    );
  }

  return getFullProfile(userId);
}

export async function replaceNotifications(userId, notifications = []) {
  await query(
    `DELETE FROM user_notifications WHERE "userId" = $1`,
    [userId]
  );

  for (const item of notifications) {
    await query(
      `INSERT INTO user_notifications
        ("userId", title, message, "isRead")
       VALUES ($1, $2, $3, $4)`,
      [
        userId,
        item.title || "",
        item.message || "",
        Boolean(item.isRead)
      ]
    );
  }

  return getFullProfile(userId);
}

export async function replaceFavourites(userId, favourites = []) {
  await query(
    `DELETE FROM user_favourites WHERE "userId" = $1`,
    [userId]
  );

  for (const item of favourites) {
    if (!item?.itemType || item?.itemId === undefined) continue;

    await query(
      `INSERT INTO user_favourites
        ("userId", "itemType", "itemId", data)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT ("userId", "itemType", "itemId")
       DO UPDATE SET data = EXCLUDED.data`,
      [
        userId,
        item.itemType,
        String(item.itemId),
        JSON.stringify(item.data || {})
      ]
    );
  }

  return getFullProfile(userId);
}
