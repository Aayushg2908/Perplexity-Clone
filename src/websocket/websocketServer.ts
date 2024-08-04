import http from "http";
import { WebSocketServer } from "ws";
import { handleConnection } from "./connectionManager";

export const initServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    handleConnection(ws);
  });

  console.log(`Websocket server started on port ${process.env.PORT}`);
};
