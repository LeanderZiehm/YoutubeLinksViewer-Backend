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

// Add a list of YouTube links
app.post("/links", async (req, res) => {
  const { urls } = req.body; // Expecting an array of URLs
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "A list of URLs is required" });
  }
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Prepare the links to be inserted
    const links = urls.map(url => ({ url }));

    // Insert all links at once
    await collection.insertMany(links);
    
    res.status(201).json({ message: `${urls.length} links added successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});