import { WebSocket } from "ws";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import handleWebSearch from "../agents/webSearchAgent";
import handleAcademicSearch from "../agents/academicSearchAgent";
import handleWritingAssistant from "../agents/writingAssistant";
import handleYoutubeSearch from "../agents/youtubeSearchAgent";
import handleRedditSearch from "../agents/redditSearchAgent";

interface Message {
  type: string;
  content: string;
  copilot: string;
  focus: string;
  history: Array<[string, string]>;
}

export const handleMessage = (message: string, ws: WebSocket) => {
  try {
    const paresedMessage = JSON.parse(message) as Message;
    const id = Math.random().toString(36).substring(7);

    if (!paresedMessage.content) {
      return ws.send(
        JSON.stringify({ type: "error", data: "Invalid message format" })
      );
    }

    const history: BaseMessage[] = paresedMessage.history.map((msg) => {
      if (msg[0] === "human") {
        return new HumanMessage({
          content: msg[1],
        });
      } else {
        return new AIMessage({
          content: msg[1],
        });
      }
    });

    if (paresedMessage.type === "message") {
      switch (paresedMessage.focus) {
        case "webSearch": {
          const emitter = handleWebSearch(paresedMessage.content, history);
          emitter.on("data", (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "response") {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            } else if (parsedData.type === "sources") {
              ws.send(
                JSON.stringify({
                  type: "sources",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            }
          });
          emitter.on("end", () => {
            ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
          });
          emitter.on("error", (data) => {
            const parsedData = JSON.parse(data);
            ws.send(JSON.stringify({ type: "error", data: parsedData.data }));
          });
          break;
        }
        case "academicSearch": {
          const emitter = handleAcademicSearch(paresedMessage.content, history);
          emitter.on("data", (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "response") {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            } else if (parsedData.type === "sources") {
              ws.send(
                JSON.stringify({
                  type: "sources",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            }
          });
          emitter.on("end", () => {
            ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
          });
          emitter.on("error", (data) => {
            const parsedData = JSON.parse(data);
            ws.send(JSON.stringify({ type: "error", data: parsedData.data }));
          });
          break;
        }
        case "writingAssistant": {
          const emitter = handleWritingAssistant(
            paresedMessage.content,
            history
          );
          emitter.on("data", (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "response") {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            } else if (parsedData.type === "sources") {
              ws.send(
                JSON.stringify({
                  type: "sources",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            }
          });
          emitter.on("end", () => {
            ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
          });
          emitter.on("error", (data) => {
            const parsedData = JSON.parse(data);
            ws.send(JSON.stringify({ type: "error", data: parsedData.data }));
          });
          break;
        }
        case "youtubeSearch": {
          const emitter = handleYoutubeSearch(paresedMessage.content, history);
          emitter.on("data", (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "response") {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            } else if (parsedData.type === "sources") {
              ws.send(
                JSON.stringify({
                  type: "sources",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            }
          });
          emitter.on("end", () => {
            ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
          });
          emitter.on("error", (data) => {
            const parsedData = JSON.parse(data);
            ws.send(JSON.stringify({ type: "error", data: parsedData.data }));
          });
          break;
        }
        case "redditSearch": {
          const emitter = handleRedditSearch(paresedMessage.content, history);
          emitter.on("data", (data) => {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "response") {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            } else if (parsedData.type === "sources") {
              ws.send(
                JSON.stringify({
                  type: "sources",
                  data: parsedData.data,
                  messageId: id,
                })
              );
            }
          });
          emitter.on("end", () => {
            ws.send(JSON.stringify({ type: "messageEnd", messageId: id }));
          });
          emitter.on("error", (data) => {
            const parsedData = JSON.parse(data);
            ws.send(JSON.stringify({ type: "error", data: parsedData.data }));
          });
          break;
        }
      }
    }
  } catch (error) {
    console.error("Failed to handle message", error);
    ws.send(JSON.stringify({ type: "error", data: "Invalid message format" }));
  }
};
