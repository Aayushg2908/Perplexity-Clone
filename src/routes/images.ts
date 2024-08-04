import express from "express";
import imageSearchChain from "../agents/imageSearchAgent";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query, chat_history } = req.body;

    const images = await imageSearchChain.invoke({
      query,
      chat_history,
    });

    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
