const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')

const MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3vod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
const port = 5000;

app.use(cors())
app.use(bodyParser.json())

console.log(process.env.DB_PASS)

app.get('/', (req, res) => {
  res.send('Hello World!')
})





client.connect(err => {
  const productsCollection = client.db("emaJohnStrore").collection("products");
  const ordersCollection = client.db("emaJohnStrore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    console.log(product)
    productsCollection.insertMany(product)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })


  // all product load

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  // single product load

  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  // review order post

  app.post('/productsByKeys', (req, res) => {

    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents)
      })


  })

  // add order

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order)
    ordersCollection.insertOne(order)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })


});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})