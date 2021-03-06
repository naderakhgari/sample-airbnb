const express = require("express");
const mongodb = require("mongodb");
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const option = { useUnifiedTopology: true };

const uri = process.env.DB_URI;

const client = new mongodb.MongoClient(uri, option);
client.connect(() => {
  const db = client.db("sample_airbnb");
  const collection = db.collection("listingsAndReviews");

  app.get("/room/search", (req, res) => {
    const { name, summary } = req.query;
    if (!name && !summary) {
      return res.status(400).send("please try again with name or summary!");
    }
    const searchObj = { $or: [{ name: name }, { summary: summary }] };
    collection.find(searchObj).toArray((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  });

  app.get("/room/:price", (req, res) => {
    if (req.params.price === undefined) {
        return res.status(400).send("please try again with name or summary!");
      }
    const { price } = req.params;
    const searchObj = { price:Number(price) };
    collection.find(searchObj).toArray((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is listening to ${port}`));
