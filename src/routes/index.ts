import express from "express";
import imagesRouter from "./images";
import videosRouter from "./videos";

const router = express.Router();

router.use("/images", imagesRouter);
router.use("/videos", videosRouter);

export default router;
