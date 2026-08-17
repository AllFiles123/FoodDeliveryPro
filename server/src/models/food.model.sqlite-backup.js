import {
  getDatabase,
  saveDatabase,
} from "../database/database.js";


export function createFoodTable(){

  const db = getDatabase();

  db.run(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurantId INTEGER NOT NULL,
      name TEXT NOT NULL,
      image TEXT,
      description TEXT,
      category TEXT,
      price REAL NOT NULL,
      rating REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDatabase();

}


export function createFood(data){

  const db = getDatabase();

  const statement = db.prepare(`
    INSERT INTO foods
    (
      restaurantId,
      name,
      image,
      description,
      category,
      price,
      rating
    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `);


  statement.run([
    data.restaurantId,
    data.name,
    data.image,
    data.description,
    data.category,
    data.price,
    data.rating || 0,
  ]);


  statement.free();

  saveDatabase();

}


export function getFoodsByRestaurantId(restaurantId){

  const db = getDatabase();


  const result = db.exec(`
    SELECT *
    FROM foods
    WHERE restaurantId = ${restaurantId}
    ORDER BY id DESC
  `);



  if(!result.length){

    return [];

  }



  return result[0].values.map(row => {

    const obj = {};

    result[0].columns.forEach((col,index)=>{

      obj[col] = row[index];

    });


    return obj;

  });


}


export function getFoodById(id){

  const db = getDatabase();

  const statement = db.prepare(`
    SELECT *
    FROM foods
    WHERE id = ?
  `);


  const result = statement.getAsObject([
    id
  ]);


  statement.free();

  return result;

}
