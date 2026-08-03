import {
  getDatabase,
  saveDatabase,
} from "../database/database.js";


export function createRestaurantTable() {

  const db = getDatabase();


  db.run(`
    CREATE TABLE IF NOT EXISTS restaurants (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT NOT NULL,

      image TEXT,

      description TEXT,

      category TEXT,

      rating REAL DEFAULT 0,

      deliveryTime TEXT,

      location TEXT,

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )
  `);


  saveDatabase();

}




export function createRestaurant(data) {

  const db = getDatabase();


  const statement = db.prepare(`
    INSERT INTO restaurants
    (
      name,
      image,
      description,
      category,
      rating,
      deliveryTime,
      location
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

    data.name,

    data.image || "",

    data.description || "",

    data.category || "",

    data.rating || 0,

    data.deliveryTime || "",

    data.location || ""

  ]);



  statement.free();


  saveDatabase();


  return getRestaurants();

}





export function getRestaurants() {

  const db = getDatabase();


  const result = db.exec(`
    SELECT *
    FROM restaurants
    ORDER BY id DESC
  `);



  if (!result.length) {

    return [];

  }



  const columns = result[0].columns;


  return result[0].values.map(row => {

    const item = {};


    columns.forEach((column,index)=>{

      item[column] = row[index];

    });


    return item;

  });


}




export function getRestaurantById(id) {

  const db = getDatabase();


  const statement = db.prepare(`
    SELECT *
    FROM restaurants
    WHERE id = ?
  `);



  const result =
    statement.getAsObject([
      id
    ]);



  statement.free();



  if(!result.id){

    return null;

  }


  return result;

}
