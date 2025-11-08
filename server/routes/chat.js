// import express from "express";
// import OpenAI from "openai";
// import Message from "../models/Message.js";

// const router = express.Router();
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// router.post("/", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const aiResponse = await client.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: message }],
//     });

//     const reply = aiResponse.choices[0]?.message?.content || "No response";
//     await Message.create({ sender: "AI", message: reply });

//     res.json({ reply });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from "express";
import OpenAI from "openai";
import Message from "../models/Message.js";

const router = express.Router();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received message:", message);

    const aiResponse = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = aiResponse.choices[0]?.message?.content || "No response";

    await Message.create({ sender: "AI", message: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
