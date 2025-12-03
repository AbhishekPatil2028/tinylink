import express from "express";
import { createLink, listLinks, linkStats, deleteLink } from "../controllers/link.controller.js";

const router = express.Router();

router.post("/links", createLink);
router.get("/links", listLinks);
router.get("/links/:code", linkStats);
router.delete("/links/:code", deleteLink);

export default router;
