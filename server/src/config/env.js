import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  appName: process.env.APP_NAME ?? "FoodDeliveryPro",
  appUrl: process.env.APP_URL ?? "http://localhost:5000",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  dbName: process.env.DB_NAME ?? "food_delivery.db",
  uploadPath: process.env.UPLOAD_PATH ?? "src/uploads",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
};

export default env;
