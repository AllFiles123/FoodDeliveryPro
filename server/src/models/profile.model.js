import { query } from "../database/postgres.js";

export async function createProfileTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "profileImage" TEXT,
      theme TEXT DEFAULT 'light',
      language TEXT DEFAULT 'English',
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_addresses (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      label TEXT DEFAULT 'Home',
      address TEXT NOT NULL,
      city TEXT,
      phone TEXT,
      "isDefault" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_payment_methods (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      "cardName" TEXT,
      "lastFour" TEXT,
      "isDefault" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT,
      "isRead" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function getProfileData(userId) {
  const profile = await query(`
    SELECT
      u.id,
      u."fullName",
      u.email,
      u.phone,
      u.role,
      p."profileImage",
      COALESCE(p.theme, 'light') AS theme,
      COALESCE(p.language, 'English') AS language
    FROM users u
    LEFT JOIN user_profiles p
      ON p."userId" = u.id
    WHERE u.id = $1
    LIMIT 1
  `, [userId]);

  const addresses = await query(`
    SELECT *
    FROM user_addresses
    WHERE "userId" = $1
    ORDER BY "isDefault" DESC, id DESC
  `, [userId]);

  const payments = await query(`
    SELECT *
    FROM user_payment_methods
    WHERE "userId" = $1
    ORDER BY "isDefault" DESC, id DESC
  `, [userId]);

  const notifications = await query(`
    SELECT *
    FROM user_notifications
    WHERE "userId" = $1
    ORDER BY id DESC
  `, [userId]);

  return {
    user: profile.rows[0] || null,
    addresses: addresses.rows,
    paymentMethods: payments.rows,
    notifications: notifications.rows,
  };
}

export async function updateProfileData(userId, data) {
  const {
    fullName,
    phone,
    profileImage,
    theme,
    language,
  } = data;

  await query(`
    UPDATE users
    SET
      "fullName" = COALESCE($1, "fullName"),
      phone = COALESCE($2, phone),
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $3
  `, [fullName || null, phone || null, userId]);

  await query(`
    INSERT INTO user_profiles
      ("userId", "profileImage", theme, language)
    VALUES
      ($1, $2, COALESCE($3, 'light'), COALESCE($4, 'English'))
    ON CONFLICT ("userId")
    DO UPDATE SET
      "profileImage" = COALESCE(EXCLUDED."profileImage", user_profiles."profileImage"),
      theme = COALESCE(EXCLUDED.theme, user_profiles.theme),
      language = COALESCE(EXCLUDED.language, user_profiles.language),
      "updatedAt" = CURRENT_TIMESTAMP
  `, [
    userId,
    profileImage || null,
    theme || "light",
    language || "English",
  ]);

  return getProfileData(userId);
}

export async function addAddress(userId, data) {
  const {
    label = "Home",
    address,
    city = "",
    phone = "",
    isDefault = false,
  } = data;

  if (isDefault) {
    await query(`
      UPDATE user_addresses
      SET "isDefault" = false
      WHERE "userId" = $1
    `, [userId]);
  }

  const result = await query(`
    INSERT INTO user_addresses
      ("userId", label, address, city, phone, "isDefault")
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [userId, label, address, city, phone, isDefault]);

  return result.rows[0];
}

export async function updateAddress(userId, addressId, data) {
  const {
    label,
    address,
    city,
    phone,
    isDefault,
  } = data;

  if (isDefault) {
    await query(`
      UPDATE user_addresses
      SET "isDefault" = false
      WHERE "userId" = $1
    `, [userId]);
  }

  const result = await query(`
    UPDATE user_addresses
    SET
      label = COALESCE($1, label),
      address = COALESCE($2, address),
      city = COALESCE($3, city),
      phone = COALESCE($4, phone),
      "isDefault" = COALESCE($5, "isDefault"),
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $6
      AND "userId" = $7
    RETURNING *
  `, [
    label ?? null,
    address ?? null,
    city ?? null,
    phone ?? null,
    isDefault ?? null,
    addressId,
    userId,
  ]);

  return result.rows[0] || null;
}

export async function deleteAddress(userId, addressId) {
  const result = await query(`
    DELETE FROM user_addresses
    WHERE id = $1
      AND "userId" = $2
    RETURNING id
  `, [addressId, userId]);

  return result.rows[0] || null;
}

export async function addPaymentMethod(userId, data) {
  const {
    type,
    cardName = "",
    lastFour = "",
    isDefault = false,
  } = data;

  if (!type) {
    throw new Error("Payment type is required");
  }

  if (isDefault) {
    await query(`
      UPDATE user_payment_methods
      SET "isDefault" = false
      WHERE "userId" = $1
    `, [userId]);
  }

  const result = await query(`
    INSERT INTO user_payment_methods
      ("userId", type, "cardName", "lastFour", "isDefault")
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *
  `, [userId, type, cardName, lastFour, isDefault]);

  return result.rows[0];
}

export async function deletePaymentMethod(userId, paymentId) {
  const result = await query(`
    DELETE FROM user_payment_methods
    WHERE id = $1
      AND "userId" = $2
    RETURNING id
  `, [paymentId, userId]);

  return result.rows[0] || null;
}

export async function markNotificationRead(userId, notificationId) {
  const result = await query(`
    UPDATE user_notifications
    SET "isRead" = true
    WHERE id = $1
      AND "userId" = $2
    RETURNING *
  `, [notificationId, userId]);

  return result.rows[0] || null;
}
