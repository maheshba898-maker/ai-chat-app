import express from "express";
import Message from "../models/Message.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Ollama runs on localhost:11434 by default
const OLLAMA_URL = "http://localhost:11434/api/generate";

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received message:", message);

    // Call Ollama API
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:mini", // Change this if you downloaded a different model
        prompt: message,
        stream: false,
      }),
    });

    const data = await response.json();
    const reply = data.response;

    console.log("Ollama reply:", reply);

    // Save to MongoDB
    await Message.create({ sender: "AI", message: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
