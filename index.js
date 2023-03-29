const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from time to travel server')
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://timeToTravel:h5mOUO57zGqMN695@cluster0.w1kojzp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});