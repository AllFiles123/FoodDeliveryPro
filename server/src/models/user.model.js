import {
  getDatabase,
  saveDatabase,
} from "../database/database.js";


export function createUserTable() {

  const db = getDatabase();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDatabase();
}



export function createUser({
  fullName,
  email,
  phone,
  password,
  role = "user",
}) {

  const db = getDatabase();


  const statement = db.prepare(`
    INSERT INTO users
    (
      fullName,
      email,
      phone,
      password,
      role
    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `);


  statement.run([
    fullName,
    email,
    phone,
    password,
    role,
  ]);


  statement.free();


  saveDatabase();


  return getUserByEmail(email);
}




export function getUserByEmail(email) {

  const db = getDatabase();


  const statement = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `);


  const result =
    statement.getAsObject([
      email,
    ]);


  statement.free();


  if (!result.id) {
    return null;
  }


  return result;
}




export function getUserById(id) {

  const db = getDatabase();


  const statement = db.prepare(`
    SELECT
      id,
      fullName,
      email,
      phone,
      role,
      createdAt,
      updatedAt
    FROM users
    WHERE id = ?
  `);


  const result =
    statement.getAsObject([
      id,
    ]);


  statement.free();


  if (!result.id) {
    return null;
  }


  return result;
}


export function createPasswordResetTable() {

  const db = getDatabase();

  db.run(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      otp TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  saveDatabase();
}


export function updateUserProfile({
  id,
  fullName,
  phone,
}) {

  const db = getDatabase();


  const statement = db.prepare(`
    UPDATE users
    SET
      fullName = ?,
      phone = ?,
      updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `);


  statement.run([
    fullName,
    phone,
    id,
  ]);


  statement.free();


  saveDatabase();


  return getUserById(id);
}
