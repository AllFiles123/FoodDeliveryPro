import app from "./app.js";
import env from "./config/env.js";

const PORT = env.port;

app.listen(PORT, () => {
  console.log("==================================");
  console.log(`🚀 ${env.appName} API Started`);
  console.log(`🌍 Environment : ${env.nodeEnv}`);
  console.log(`📡 Server URL  : ${env.appUrl}`);
  console.log(`🔥 Port        : ${PORT}`);
  console.log("==================================");
});
