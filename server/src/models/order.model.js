import { getDatabase, saveDatabase } from "../database/database.js";
import db from "../database/database.js";


export const createOrderTable = () => {

  getDatabase().run(`
    CREATE TABLE IF NOT EXISTS orders (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      userId INTEGER NOT NULL,

      items TEXT NOT NULL,

      totalAmount REAL NOT NULL,

      deliveryAddress TEXT,

      paymentMethod TEXT DEFAULT 'COD',

      orderStatus TEXT DEFAULT 'Order Placed',

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP

    )
  `);

};




export const createOrder = (order) => {

  const {

    userId,

    items,

    totalAmount,

    address,

    deliveryAddress,

    paymentMethod,

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

    restaurantName,

    paymentStatus


  } = order;



  const orderNumber =
    "FD" +
    Date.now();



  const stmt = getDatabase().prepare(`

    INSERT INTO orders

    (

      userId,

      items,

      totalAmount,

      deliveryAddress,

      paymentMethod,

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

      orderNumber,

      restaurantName,

      trackingStatus,

      trackingHistory

    )


    VALUES

    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)

  `);



  const result = stmt.run(

    userId,

    JSON.stringify(items),

    totalAmount || 0,

    address || deliveryAddress || fullAddress || "",

    paymentMethod || "COD",

    customerName || "",

    customerPhone || "",

    deliveryType || "",

    zone || "",

    division || "",

    district || "",

    upazila || "",

    area || "",

    fullAddress || "",

    subtotal || 0,

    vat || 0,

    discount || 0,

    paymentStatus || "Pending",

    orderNumber,

    restaurantName || "",

    "Order Placed",

    JSON.stringify([
      {
        status:"Order Placed",
        time:new Date().toISOString()
      }
    ])

  );



  return {

    id: result.lastInsertRowid,

    orderNumber

  };

};





export const getOrdersByUser = (userId) => {


  const stmt = getDatabase().prepare(`

    SELECT *

    FROM orders

    WHERE userId=?

    ORDER BY createdAt DESC

  `);



  return stmt.all(userId).map(order => ({


    ...order,


    items:

    JSON.parse(order.items || "[]"),


    trackingHistory:

    JSON.parse(order.trackingHistory || "[]")


  }));

};





export const getOrderById = (id,userId) => {


  const stmt = getDatabase().prepare(`

    SELECT *

    FROM orders

    WHERE id=? AND userId=?

  `);



  const order = stmt.get(
    id,
    userId
  );



  if(!order) return null;



  return {

    ...order,

    items:
    JSON.parse(order.items || "[]"),

    trackingHistory:
    JSON.parse(order.trackingHistory || "[]")

  };

};





export const cancelOrder = (id,userId) => {


  const stmt = getDatabase().prepare(`

    UPDATE orders

    SET

    orderStatus='Cancelled',

    cancelledAt=CURRENT_TIMESTAMP,

    updatedAt=CURRENT_TIMESTAMP


    WHERE id=? AND userId=?

  `);



  return stmt.run(

    id,

    userId

  );

};





export const updateOrderStatus = (id,status) => {


  const stmt = getDatabase().prepare(`

    UPDATE orders

    SET

    orderStatus=?,

    trackingStatus=?,

    updatedAt=CURRENT_TIMESTAMP


    WHERE id=?

  `);



  return stmt.run(

    status,

    status,

    id

  );

};

