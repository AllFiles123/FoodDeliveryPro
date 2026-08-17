import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { query } from "./database/postgres.js";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import profileDataRoutes from "./routes/profileData.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import foodRoutes from "./routes/food.routes.js";
import orderRoutes from "./routes/order.routes.js";
import searchRoutes from "./routes/search.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import addressRoutes from "./routes/address.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import {
  createUserTable,
  createPasswordResetTable,
  createUserSettingsTable,
} from "./models/user.model.js";

import { createAddressTable } from "./models/address.model.js";
import { createPaymentTable } from "./models/payment.model.js";
import { createNotificationTable } from "./models/notification.model.js";

import {
  createRestaurantTable,
} from "./models/restaurant.model.js";
import { createFoodTable } from "./models/food.model.js";
import { createOrderTable } from "./models/order.model.js";
import { createSearchTable } from "./models/search.model.js";
import { createProfileTables } from "./models/profile.model.js";
import { createProfileDataTables } from "./models/profileData.model.js";


const app = express();


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());



app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    app: "Food Delivery Pro API",
    version: "1.0.0",
    status: "Running",
  });

});



app.get("/api/health", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Server is healthy.",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

});



// Auth Routes
app.use(
  "/api/auth",
  authRoutes
);



// Profile Routes
app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/profile-data",
  profileDataRoutes
);



// Restaurant Routes
app.use(
  "/api/restaurants",
  restaurantRoutes
);

app.use(
  "/api/foods",
  foodRoutes
);


// Order Routes
app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/search",
  searchRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/addresses",
  addressRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);



app.use((req, res) => {

  res.status(404).json({
    success:false,
    message:"Route not found.",
  });

});



app.use((err, req, res, next) => {

  console.error(err);

  res.status(err.status || 500).json({
    success:false,
    message:err.message || "Internal Server Error",
  });

});



await query("SELECT 1");

await createUserTable();
await createPasswordResetTable();
await createUserSettingsTable();
await createAddressTable();
await createPaymentTable();
await createNotificationTable();
await createRestaurantTable();
await createFoodTable();
await createOrderTable();
await createSearchTable();
await createProfileTables();
await createProfileDataTables();



export default app;
