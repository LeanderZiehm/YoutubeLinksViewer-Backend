require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // Allow frontend access
app.use(express.json()); // Middleware to parse JSON

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "youtubeLinksDB"; // Database name
const collectionName = "links"; // Collection name

// Get all YouTube links
app.get("/links", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const links = await collection.find().toArray();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new YouTube link
app.post("/links", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne({ url });
    res.status(201).json({ message: "Link added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});