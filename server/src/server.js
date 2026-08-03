import app from "./app.js";
import env from "./config/env.js";

const PORT = env.port;

app.listen(PORT, "0.0.0.0", () => {
  console.log("==================================");
  console.log(`🚀 ${env.appName} API Started`);
  console.log(`🌍 Environment : ${env.nodeEnv}`);
  console.log(`📡 Server URL  : http://0.0.0.0:${PORT}`);
  console.log(`🔥 Port        : ${PORT}`);
  console.log("==================================");
});
