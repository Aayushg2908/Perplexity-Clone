import express from "express";
import http from "http";
import cors from "cors";
import routes from "./routes";
import { startWebSocketServer } from "./websocket";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api", routes);

server.listen(process.env.PORT, () => {
  console.log(`API server is running on port ${process.env.PORT}`);
});

startWebSocketServer(server);
