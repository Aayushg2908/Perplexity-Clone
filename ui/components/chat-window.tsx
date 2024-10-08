"use client";

import { Document } from "@langchain/core/documents";
import { useEffect, useRef, useState } from "react";
import EmptyChat from "./empty-chat";
import Chat from "./chat";
import Navbar from "./navbar";
import { createConversation, createMessage } from "@/actions";
import { useSearchParams } from "next/navigation";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  suggestions?: string[];
  sources?: Document[];
  createdAt: Date;
}

const useSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!ws) {
      const ws = new WebSocket(url);
      ws.onopen = () => {
        console.log("[DEBUG] open");
        setWs(ws);
      };
    }

    return () => {
      ws?.close();
    };
  }, [ws, url]);

  return ws;
};

const ChatWindow = ({
  userId,
  finalMessages,
  finalChatHistory,
}: {
  userId: string;
  finalMessages: Message[];
  finalChatHistory: [string, string][];
}) => {
  const ws = useSocket(process.env.NEXT_PUBLIC_WS_URL!);
  const [chatHistory, setChatHistory] =
    useState<[string, string][]>(finalChatHistory);
  const [messages, setMessages] = useState<Message[]>(finalMessages);
  const [loading, setLoading] = useState(false);
  const [messageAppeared, setMessageAppeared] = useState(false);
  const [focusMode, setFocusMode] = useState("webSearch");
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState(
    searchParams.get("conversationId") || ""
  );
  const messageRef = useRef<Message[]>([]);

  useEffect(() => {
    messageRef.current = messages;
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (loading) return;

    setLoading(true);
    setMessageAppeared(false);

    let sources: Document[] | undefined = undefined;
    let receivedMessage = "";
    let added = false;
    let convId = conversationId;

    ws?.send(
      JSON.stringify({
        type: "message",
        content: message,
        focus: focusMode,
        history: [...chatHistory, ["human", message]],
      })
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: message,
        id: Math.random().toString(36).substring(7),
        role: "user",
        createdAt: new Date(),
      },
    ]);

    if (userId && !conversationId && messages.length === 0) {
      try {
        convId = await createConversation(message);
        setConversationId(convId);
      } catch (error) {
        console.log(error);
      }
    }

    const messageHandler = async (e: MessageEvent) => {
      const data = JSON.parse(e.data);

      if (data.type === "sources") {
        sources = data.data;
        if (!added) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              content: "",
              id: data.messageId,
              role: "assistant",
              sources: sources,
              createdAt: new Date(),
            },
          ]);
          added = true;
        }
        setMessageAppeared(true);
      }

      if (data.type === "message") {
        if (!added) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              content: data.data,
              id: data.messageId,
              role: "assistant",
              sources: sources,
              createdAt: new Date(),
            },
          ]);
          added = true;
        }
        setMessages((prev) =>
          prev.map((message) => {
            if (message.id === data.messageId) {
              return { ...message, content: message.content + data.data };
            }
            return message;
          })
        );
        receivedMessage += data.data;
        setMessageAppeared(true);
      }

      if (data.type === "messageEnd") {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          ["human", message],
          ["assistant", receivedMessage],
        ]);
        ws?.removeEventListener("message", messageHandler);
        if (userId) {
          try {
            await createMessage({
              userMessage: message,
              assistantMessage: receivedMessage,
              conversationId: convId,
              sources: sources || [],
            });
          } catch (error) {
            console.log(error);
          }
        }
        setLoading(false);

        const lastMessage = messageRef.current[messageRef.current.length - 1];
        if (
          lastMessage.role === "assistant" &&
          lastMessage.sources &&
          lastMessage.sources.length > 0 &&
          !lastMessage.suggestions
        ) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/suggestions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chat_history: chatHistory,
              }),
            }
          );
          const data = (await response.json()) as { suggestions: string[] };
          const suggestions = data.suggestions;
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === lastMessage.id) {
                return { ...msg, suggestions: suggestions };
              }
              return msg;
            })
          );
        }
      }
    };

    ws?.addEventListener("message", messageHandler);
  };

  const rewrite = (messageId: string) => {
    const index = messages.findIndex((msg) => msg.id === messageId);
    if (index === -1) return;

    const message = messages[index - 1];
    setMessages((prev) => {
      return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    });
    setChatHistory((prev) => {
      return [...prev.slice(0, messages.length > 2 ? index - 1 : 0)];
    });

    sendMessage(message.content);
  };

  return (
    <div>
      {messages.length > 0 ? (
        <>
          <Navbar messages={messages} />
          <Chat
            loading={loading}
            messages={messages}
            sendMessage={sendMessage}
            messageAppeared={messageAppeared}
            rewrite={rewrite}
          />
        </>
      ) : (
        <EmptyChat
          sendMessage={sendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
        />
      )}
    </div>
  );
};

export default ChatWindow;
