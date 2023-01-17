// iffat nur shad
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SK);

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const donationCollection = client.db("foodBox").collection("donation");
    const blogCollection = client.db("foodBox").collection("blog");
    const eventCollection = client.db("foodBox").collection("event");
    const galleryCollection = client.db("foodBox").collection("gallery");
    const userCollection = client.db("foodBox").collection("user");

    app.post("/create-payment-intent", async (req, res) => {
      const donationAmount = req.body;
      const actualAmount = donationAmount.amountFromButton;
      const amount = actualAmount * 100;
      console.log(amount);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr",
        payment_method_types: ["card"],
      });
      console.log(paymentIntent.client_secret);
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/user", async (req, res) => {
      const query = {};
      const result = await userCollection.insertOne(query);
      res.send(result);
    });
    app.get("/user", async (req, res) => {
      const query = {};
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/donation", async (req, res) => {
      const query = req.body;
      const result = await donationCollection.insertOne(query);
      res.send(result);
    });

    app.post("/addblog", async (req, res) => {
      const query = req.body;
      console.log(query);
      const result = await blogCollection.insertOne(query);
      res.send(result);
    });

    app.post("/addevent", async (req, res) => {
      const query = req.body;
      console.log(query);
      const result = await eventCollection.insertOne(query);
      res.send(result);
    });

    app.post("/addgallery", async (req, res) => {
      const query = req.body;
      console.log(query);
      const result = await galleryCollection.insertOne(query);
      res.send(result);
    });

    app.get("/blog", async (req, res) => {
      const query = {};
      const result = await blogCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/event", async (req, res) => {
      const query = {};
      const result = await eventCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/gallery", async (req, res) => {
      const query = {};
      const result = await galleryCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    app.get("/event/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await eventCollection.findOne(query);
      res.send(result);
    });

    app.get("/gallery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await galleryCollection.findOne(query);
      res.send(result);
    });

    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const blogInfo = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          title: blogInfo.title,
          brief: blogInfo.brief,
          details: blogInfo.details,
          info: blogInfo.info,
          conclusion: blogInfo.conclusion,
          link: blogInfo.link,
          authorName: blogInfo.authorName,
          date: blogInfo.date,
        },
      };
      const options = { upsert: true };
      const result = await blogCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.put("/event/:id", async (req, res) => {
      const id = req.params.id;
      const eventInfo = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          title: eventInfo.title,
          brief: eventInfo.brief,
          details: eventInfo.details,
          info: eventInfo.info,
          conclusion: eventInfo.conclusion,
          link: eventInfo.link,
          authorName: eventInfo.authorName,
          date: eventInfo.date,
        },
      };
      const options = { upsert: true };
      const result = await eventCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.put("/gallery/:id", async (req, res) => {
      const id = req.params.id;
      const galleryInfo = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          title: galleryInfo.title,
        },
      };
      const options = { upsert: true };
      const result = await galleryCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/event/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await eventCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/gallery/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await galleryCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("food box server running");
});

app.listen(port, () => {
  console.log("Server running on:", port);
});
