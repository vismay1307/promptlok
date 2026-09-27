import app from "./app.js";
import { env } from "./config/env";

const startServer = () => {
  app.listen(env.PORT, () => {
    console.log(
      `🚀 PromptLok server running on http://localhost:${env.PORT}`
    );
  });
};

startServer();