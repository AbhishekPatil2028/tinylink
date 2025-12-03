import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./routes/api.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import { LinkService } from "./services/link.service.js";

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", "src/views");  // ensure this path matches your folder

// Static Files (CSS, JS)
app.use(express.static("public"));

// ----------------------
// Healthcheck
// ----------------------
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// ----------------------
// FRONTEND PAGE ROUTES
// ----------------------

import { pool } from "./config/db.js";

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "connected", time: result.rows[0] });
  } catch (err) {
    res.json({ error: err.message });
  }
});


// Dashboard Page (list + create)
app.get("/", async (req, res) => {
  try {
    const links = await LinkService.listLinks();
    res.render("dashboard", {
      links,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Stats Page for a specific code
app.get("/code/:code", async (req, res) => {
  try {
    const link = await LinkService.findByCode(req.params.code);
    if (!link) return res.status(404).send("Not found");

    res.render("stats", {
      link,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ----------------------
// API ROUTES (/api/...)
// ----------------------
app.use("/api", apiRoutes);

// ----------------------
// REDIRECT ROUTE (KEEP LAST!)
// ----------------------
app.use("/", redirectRoutes);

export default app;
