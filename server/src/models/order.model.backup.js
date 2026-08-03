import {
  getDatabase,
  saveDatabase,
} from "../database/database.js";



export function createOrderTable(){

  const db = getDatabase();


  db.run(`

    CREATE TABLE IF NOT EXISTS orders (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      userId INTEGER NOT NULL,

      items TEXT NOT NULL,

      totalAmount REAL NOT NULL,

      paymentMethod TEXT NOT NULL,

      address TEXT NOT NULL,

      deliveryCharge REAL DEFAULT 0,

      status TEXT DEFAULT 'Pending',

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )

  `);


  saveDatabase();

}





export function createOrder({

  userId,

  items,

  totalAmount,

  paymentMethod,

  address,

  deliveryCharge,

}){


  const db = getDatabase();



  const statement = db.prepare(`

    INSERT INTO orders

    (

      userId,

      items,

      totalAmount,

      paymentMethod,

      address,

      deliveryCharge

    )

    VALUES(?,?,?,?,?,?)

  `);



  statement.run([

    userId,

    JSON.stringify(items),

    totalAmount,

    paymentMethod,

    address,

    deliveryCharge

  ]);



  statement.free();


  saveDatabase();


}





export function getOrdersByUser(userId){


  const db = getDatabase();



  const result = db.exec(`

    SELECT *

    FROM orders

    WHERE userId = ${userId}

    ORDER BY id DESC

  `);



  if(
    !result.length ||
    !result[0].values.length
  ){

    return [];

  }



  const columns =
    result[0].columns;


  return result[0].values.map(row=>{


    const order={};


    columns.forEach((col,index)=>{

      order[col]=row[index];

    });



    return order;


  });


}
