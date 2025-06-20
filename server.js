const express = require("express");
const app = express();
app.use(express.json());
app.get("/health", (req, res) => res.json({status: "ok", service: "YourTravelSearch", timestamp: new Date().toISOString()}));
app.get("/", (req, res) => res.send(`<!DOCTYPE html><html><head><title>YourTravelSearch</title></head><body><h1>YourTravelSearch</h1><p>Production Server Running</p><p>Flight booking platform with live Duffel API integration</p><p><a href="/health">Health Check</a></p></body></html>`));
const port = process.env.PORT || 10000;
app.listen(port, "0.0.0.0", () => console.log("YourTravelSearch server running on port", port));
