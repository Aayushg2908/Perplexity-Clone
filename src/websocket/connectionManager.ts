import { WebSocket } from "ws";
import { handleMessage } from "./messageHandler";

export const handleConnection = async (ws: WebSocket) => {
  ws.on(
    "message",
    async (message) => await handleMessage(message.toString(), ws)
  );

  ws.on("close", () => console.log("Connection Closed"));
};
