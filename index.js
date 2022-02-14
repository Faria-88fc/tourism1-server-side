const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require('dotenv').config();
const cors = require('cors');

// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kcpm4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('tour_packages');
    const packageCollection = database.collection('packages');
    const bookingCollection = database.collection('bookings');

    // post api
    app.post('/packages', async(req, res) => {
      const package = req.body; 
      const result = await packageCollection.insertOne(package);
      res.json(result);
    });

    // get package api
    app.get('/packages', async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    // add bookings api
    app.post('/bookings', async(req,res)=>{
    const order = req.body;
    const result = await bookingCollection.insertOne(order);
    res.send(result);
    });

    // my bookings
    app.get('/myBookings/:email', async(req, res) =>{
      const result = await bookingCollection.find({email: req.params.email}).toArray();
      res.send(result);
    });

    // delete bookings
    app.delete("/deletebookings/:id", async(req, res)=>{
      // console.log(req.params.id)
      const result = await bookingCollection.deleteOne({
        _id: ObjectId(req.params.id)
      });
      res.send(result);
    });

    // get all orders
    app.get('/bookings',async(req, res)=>{
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
    })

    // update status

    app.put('/updatestatus/:id',async(req, res) =>{
      const id = req.params.id
      console.log(id)
      const updateStatus = req.body.status;
      console.log(updateStatus)
      const filter = {_id: ObjectId(id)};
      const result = await bookingCollection.updateOne(filter,{
        $set:{status:updateStatus}
      })
      console.log(result)
      res.send(result);
    })
  }

finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req,res)=>{
  res.send('running')
})

app.listen(port, () => {
  console.log( port);
})