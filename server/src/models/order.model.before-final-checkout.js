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

      customerName TEXT DEFAULT '',

      customerPhone TEXT DEFAULT '',

      division TEXT DEFAULT '',

      district TEXT DEFAULT '',

      upazila TEXT DEFAULT '',

      area TEXT DEFAULT '',

      fullAddress TEXT DEFAULT '',

      items TEXT NOT NULL,

      subtotal REAL DEFAULT 0,

      vat REAL DEFAULT 0,

      totalAmount REAL NOT NULL,

      paymentMethod TEXT NOT NULL,

      paymentStatus TEXT DEFAULT 'Pending',

      deliveryCharge REAL DEFAULT 0,

      orderStatus TEXT DEFAULT 'Pending',

      status TEXT DEFAULT 'Pending',

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )

  `);


  saveDatabase();

}





export function createOrder({

  userId,

  customerName = "",

  customerPhone = "",

  division = "",

  district = "",

  upazila = "",

  area = "",

  fullAddress = "",

  items,

  subtotal = 0,

  vat = 0,

  totalAmount,

  paymentMethod,

  paymentStatus = "Pending",

  deliveryCharge = 0,

  orderStatus = "Pending"

}){


  const db = getDatabase();



  const statement = db.prepare(`

    INSERT INTO orders

    (

      userId,

      customerName,

      customerPhone,

      division,

      district,

      upazila,

      area,

      fullAddress,

      items,

      subtotal,

      vat,

      totalAmount,

      paymentMethod,

      paymentStatus,

      deliveryCharge,

      orderStatus

    )

    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

  `);



  statement.run([

    userId,

    customerName,

    customerPhone,

    division,

    district,

    upazila,

    area,

    fullAddress,

    JSON.stringify(items),

    subtotal,

    vat,

    totalAmount,

    paymentMethod,

    paymentStatus,

    deliveryCharge,

    orderStatus

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
