import express from "express";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import suggestionsGeneratorChain from "../agents/suggestionGeneratorAgent";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { chat_history } = req.body;

    chat_history = chat_history.map((msg: any) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.rol === "assistant") {
        return new AIMessage(msg.content);
      }
    });

    const suggestions = await suggestionsGeneratorChain.invoke({
      chat_history,
    });

    res.status(200).json({ suggestions });
  } catch (error) {
    res
      .status(500)
      .json({ message: `An error has occurred. : ${error.message}` });
    console.log(error.message);
  }
});

export default router;
