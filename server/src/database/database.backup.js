import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import env from "../config/env.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const databaseFolder = path.join(
  __dirname,
  "../../database"
);


const databaseFile = path.join(
  databaseFolder,
  env.dbName
);


let db;


async function connectDatabase() {

  const SQL = await initSqlJs();


  if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, {
      recursive: true,
    });
  }


  if (fs.existsSync(databaseFile)) {

    const fileBuffer =
      fs.readFileSync(databaseFile);

    db = new SQL.Database(fileBuffer);

  } else {

    db = new SQL.Database();

  }


  console.log("✅ SQLite Connected");
  console.log(`📂 Database: ${databaseFile}`);


  return db;
}


function getDatabase() {
  return db;
}


function saveDatabase() {

  if (!db) return;


  const data = db.export();


  fs.writeFileSync(
    databaseFile,
    Buffer.from(data)
  );
}


export {
  connectDatabase,
  getDatabase,
  saveDatabase,
};

export default getDatabase;
