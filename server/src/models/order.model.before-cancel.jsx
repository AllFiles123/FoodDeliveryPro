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





export function createOrder(data){


  const db = getDatabase();



  const statement = db.prepare(`

    INSERT INTO orders

    (

      userId,

      items,

      totalAmount,

      paymentMethod,

      address,

      deliveryCharge,

      customerName,

      customerPhone,

      deliveryType,

      zone,

      division,

      district,

      upazila,

      area,

      fullAddress,

      subtotal,

      vat,

      discount,

      paymentStatus,

      orderStatus

    )

    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

  `);



  statement.run([


    data.userId,

    JSON.stringify(data.items),


    data.totalAmount,


    data.paymentMethod,


    data.address,


    data.deliveryCharge || 0,


    data.customerName || "",


    data.customerPhone || "",


    data.deliveryType || "",


    data.zone || "",


    data.division || "",


    data.district || "",


    data.upazila || "",


    data.area || "",


    data.fullAddress || "",


    data.subtotal || 0,


    data.vat || 0,


    data.discount || 0,


    data.paymentStatus || "Pending",


    data.orderStatus || "Pending"


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
