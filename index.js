const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: ["http://localhost:5173", "https://art-and-craft-b1839.web.app"],
};
app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvotocy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const newItemCollection = client.db("craftDB").collection("art&craft");

    const subcategoryCollection = client.db("craftDB").collection("subCategory");
    app.get('/categories', async (req, res) => {
      const cursor = subcategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    

    app.get("/addItem", async (req, res) => {
      const cursor = newItemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/showAllac", async (req, res) => {
      const cusrsor = newItemCollection.find();
      const result = await cusrsor.toArray();
      res.send(result);
    });

    app.get('/showAllac/:subcategory', async (req, res) => {
      const subcategory = req.params.subcategory;
      const query = { name: subcategory };
      const cursor = subcategoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/showAllac/sort/:email/:customize", async (req, res) => {
      const customize = req.params.customize;
      const email = req.params.email;
      const query = { customize: customize, userEmail: email };
      const cursor = newItemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/viewdetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newItemCollection.findOne(query);
      res.send(result);
    });
    app.get("/myartcraft/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const cursor = newItemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newItemCollection.findOne(query);
      res.send(result);
    });

    app.post("/addItem", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await newItemCollection.insertOne(newItem);
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = req.body;
      const Item = {
        $set: {
          itemName: updateItem.itemName,
          photoURL: updateItem.photoURL,
          description: updateItem.description,
          price: updateItem.price,
          rating: updateItem.rating,
          sub: updateItem.sub,
          customize: updateItem.customize,
          status: updateItem.status,
          time: updateItem.time,
        },
      };
      const result = await newItemCollection.updateOne(filter, Item, options);
      res.send(result);
    });
    app.delete("/myartcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newItemCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My server is Running");
});
app.listen(port, () => {
  console.log(`Server is running on port :${port}`);
});
