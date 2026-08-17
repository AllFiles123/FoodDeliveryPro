import { query } from "../database/postgres.js";


export async function createOrderTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      "userId" BIGINT NOT NULL,
      items TEXT NOT NULL,
      "totalAmount" NUMERIC NOT NULL,
      "paymentMethod" TEXT DEFAULT 'COD',
      address TEXT,
      "deliveryCharge" NUMERIC DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      "customerName" TEXT,
      "customerPhone" TEXT,
      "deliveryType" TEXT,
      zone TEXT,
      division TEXT,
      district TEXT,
      upazila TEXT,
      area TEXT,
      "fullAddress" TEXT,
      subtotal NUMERIC DEFAULT 0,
      vat NUMERIC DEFAULT 0,
      discount NUMERIC DEFAULT 0,
      "paymentStatus" TEXT DEFAULT 'Pending',
      "orderStatus" TEXT DEFAULT 'Order Placed',
      "orderNumber" TEXT,
      "restaurantName" TEXT,
      "trackingStatus" TEXT DEFAULT 'Order Placed',
      "trackingHistory" TEXT DEFAULT '[]',
      "estimatedDeliveryTime" TEXT DEFAULT '30-45 minutes',
      "cancelledAt" TIMESTAMPTZ DEFAULT NULL,
      "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
}


export async function createOrder(order) {
  const {
    userId,
    items,
    totalAmount,
    deliveryAddress,
    address,
    paymentMethod,
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
    restaurantName,
    status,
    orderStatus,
    trackingStatus,
    trackingHistory,
  } = order;


  const orderNumber =
    "FD" + Date.now();


  const result = await query(
    `
    INSERT INTO orders
    (
      "userId",
      items,
      "totalAmount",
      address,
      "deliveryCharge",
      "paymentMethod",
      "customerName",
      "customerPhone",
      "deliveryType",
      zone,
      division,
      district,
      upazila,
      area,
      "fullAddress",
      subtotal,
      vat,
      discount,
      "paymentStatus",
      status,
      "orderStatus",
      "orderNumber",
      "restaurantName",
      "trackingStatus",
      "trackingHistory"
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
      $12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
      $23,$24,$25
    )
    RETURNING *
    `,
    [
      userId,
      JSON.stringify(items || []),
      totalAmount || 0,
      address || deliveryAddress || fullAddress || "",
      deliveryCharge || 0,
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
      status || orderStatus || "Pending",
      orderStatus || status || "Pending",
      orderNumber,
      restaurantName || "",
      trackingStatus || orderStatus || status || "Pending",
      JSON.stringify(trackingHistory || []),
    ]
  );


  const orderResult = result.rows[0];


  return {
    ...orderResult,
    items: JSON.parse(orderResult.items || "[]"),
    trackingHistory: JSON.parse(
      orderResult.trackingHistory || "[]"
    ),
  };
}


export async function getOrdersByUser(userId) {
  const dbInfo = await query(`
    SELECT
      current_database() AS database,
      current_schema() AS schema,
      current_user AS db_user,
      inet_server_addr()::text AS server_ip,
      inet_server_port() AS server_port,
      current_setting('search_path') AS search_path
  `);

  console.log("===== RENDER DATABASE DEBUG =====");
  console.log(dbInfo.rows[0]);


  const result = await query(
    `
    SELECT *
    FROM orders
    WHERE "userId" = $1
    ORDER BY "createdAt" DESC
    `,
    [userId]
  );


  return result.rows.map((order) => ({
    ...order,
    items: JSON.parse(order.items || "[]"),
    trackingHistory: JSON.parse(
      order.trackingHistory || "[]"
    ),
  }));
}


export async function getOrderById(id, userId) {
  const result = await query(
    `
    SELECT *
    FROM orders
    WHERE id = $1
      AND "userId" = $2
    LIMIT 1
    `,
    [id, userId]
  );


  const order = result.rows[0];


  if (!order) {
    return null;
  }


  return {
    ...order,
    items: JSON.parse(order.items || "[]"),
    trackingHistory: JSON.parse(
      order.trackingHistory || "[]"
    ),
  };
}


export async function cancelOrder(id, userId) {
  const trackingHistory = JSON.stringify([
    {
      status: "Cancelled",
      time: new Date().toISOString(),
    },
  ]);


  const result = await query(
    `
    UPDATE orders
    SET
      status = 'Cancelled',
      "orderStatus" = 'Cancelled',
      "trackingStatus" = 'Cancelled',
      "trackingHistory" = $1,
      "cancelledAt" = CURRENT_TIMESTAMP,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $2
      AND "userId" = $3
      AND "orderStatus" <> 'Cancelled'
    RETURNING *
    `,
    [
      trackingHistory,
      id,
      userId,
    ]
  );


  const order = result.rows[0];


  if (!order) {
    return null;
  }


  return {
    ...order,
    items: JSON.parse(order.items || "[]"),
    trackingHistory: JSON.parse(
      order.trackingHistory || "[]"
    ),
  };
}


export async function updateOrderStatus(id, status) {
  const result = await query(
    `
    UPDATE orders
    SET
      status = $1,
      "orderStatus" = $1,
      "trackingStatus" = $1,
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );


  const order = result.rows[0];


  if (!order) {
    return null;
  }


  return {
    ...order,
    items: JSON.parse(order.items || "[]"),
    trackingHistory: JSON.parse(
      order.trackingHistory || "[]"
    ),
  };
}
