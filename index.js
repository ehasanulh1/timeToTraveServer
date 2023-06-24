const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6mkgh1e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const destinationCollection = client.db('timeToTravel').collection('destination');
        const reviewsCollection = client.db('timeToTravel').collection('reviews')


        app.get('/destinations', async (req, res) => {
            const query = {};
            const cursor = destinationCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        });

        app.get('/destinations/seeAll', async (req, res) => {
            const query = {};
            const cursor = destinationCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const selectedDestination = await destinationCollection.findOne(query)
            res.send(selectedDestination);
        })

        app.get('/reviews', async (req, res) => {
            const id = req.query.service_id
            const query = {};
            const cursor = reviewsCollection.find(query);
            const storedReviews = await cursor.toArray();
            if (req.query.email) {
                const queryEmail = req.query.email;
                const myReviews = storedReviews.filter(review => review.email === queryEmail)
                res.send(myReviews)
            }

            if (id) {
                const reviews = storedReviews.filter(review => review.service_id === id)
                res.send(reviews);
            }

        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        });

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const review = req.body;
            console.log(review)
            const options = { upsert: true };
            const updateReview = {
                $set: {
                    rating: review.rating,
                    message: review.message
                }
            }
            const result = await reviewsCollection.updateOne(filter, updateReview, options);
            res.send(result)
            console.log(updateReview)

        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query)
            console.log(result);
            res.send(result)
        });
    }
    finally { }
}
run().catch(err => console.log(err))



app.get('/', async (req, res) => {
    res.send('Hello from time to travel server')
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})