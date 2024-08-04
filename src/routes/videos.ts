import express from "express";
import videoSearchChain from "../agents/videoSearchAgent";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query, chat_history } = req.body;

    const videos = await videoSearchChain.invoke({
      query,
      chat_history,
    });

    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
