const express = require("express");
const cors = require("cors");
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4gmgst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const listingCollection = client.db("roommateDB").collection("listings");
    const likeCollection = client.db("roommateDB").collection("likes");

    app.get("/all-listings", async(req, res) => {
        const result = await listingCollection.find().toArray()
        res.send(result)
    })

    app.get("/listings", async(req, res) => {
        const email = req.query.email;
        const query = {userEmail: email};
        const result = await listingCollection.find(query).toArray()
        res.send(result)
    })

    app.get("/featured-listings", async(req, res) => {
        const result = await listingCollection.find({availability: "Available"}).limit(6).toArray();
        res.send(result)
    })

    app.get("/listings/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await listingCollection.findOne(query);
        res.send(result);
    })

    app.post("/listings", async(req, res) => {
        const newListing = req.body;
        console.log(newListing);
        const result = await listingCollection.insertOne(newListing);
        res.send(result)
    })

    app.post("/likes", async(req, res) => {
      const newLike = req.body;
      const result = await likeCollection.insertOne(newLike);
      res.send(result);
    })

    app.delete("/listings/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await listingCollection.deleteOne(query);
      res.send(result)
    })

    app.put("/listings/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedListing = req.body;
      const updatedDoc = {
        $set: updatedListing
      };

      const result = await listingCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("server is here")
});


app.listen(port, () => {
    console.log("server is running");
})