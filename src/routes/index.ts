import express from "express";
import imagesRouter from "./images";
import videosRouter from "./videos";
import suggestionsRouter from "./suggestions";

const router = express.Router();

router.use("/images", imagesRouter);
router.use("/videos", videosRouter);
router.use("/suggestions", suggestionsRouter);

export default router;
