import { query } from "../database/postgres.js";


export async function createUserTable() {

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

}


export async function createUser({
  fullName,
  email,
  phone,
  password,
  role = "user",
}) {

  const result = await query(
    `
    INSERT INTO users
    (
      "fullName",
      email,
      phone,
      password,
      role
    )
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING
      id,
      "fullName",
      email,
      phone,
      role,
      "createdAt",
      "updatedAt"
    `,
    [
      fullName,
      email,
      phone || null,
      password,
      role,
    ]
  );

  return result.rows[0];

}


export async function getUserByEmail(email) {

  const result = await query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;

}


export async function getUserById(id) {

  const result = await query(
    `
    SELECT
      id,
      "fullName",
      email,
      phone,
      role,
      "createdAt",
      "updatedAt"
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;

}


export async function createPasswordResetTable() {

  await query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL,
      otp TEXT NOT NULL,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

}


export async function updateUserProfile({
  id,
  fullName,
  phone,
}) {

  const result = await query(
    `
    UPDATE users
    SET
      "fullName" = $1,
      phone = $2,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING
      id,
      "fullName",
      email,
      phone,
      role,
      "createdAt",
      "updatedAt"
    `,
    [
      fullName,
      phone || null,
      id,
    ]
  );

  return result.rows[0] || null;

}

