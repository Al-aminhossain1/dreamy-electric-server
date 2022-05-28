const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const query = require('express/lib/middleware/query');
require('dotenv').config()
// Use Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohevh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        client.connect();
        const toolsCollection = client.db("dreamy-electric").collection("tools");
        const usersCollection = client.db("dreamy-electric").collection("users");
        const ordersCollection = client.db("dreamy-electric").collection("orders");
        const reviewsCollection = client.db("dreamy-electric").collection("reviews");

        // Get Tools
        app.get('/tool', async (req, res) => {
            const query = {};
            const tools = await toolsCollection.find().toArray();
            res.send(tools);
        })

        app.get('/tool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tools = await toolsCollection.findOne(query);
            res.send(tools);
        })
        // Post order
        app.post('/order', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.send(result);

        })
        // Get order use React query

        app.get('/order', async (req, res) => {
            const customer = req.query.customer;
            const query = { customer: customer };
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        })
        // Delete Order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })
        // Post Review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        // Get Review

        app.get('/review', async (req, res) => {
            const query = {};
            const reviews = await reviewsCollection.find().toArray();
            res.send(reviews);
        })
        // Get All Users
        app.get('/user', async (req, res) => {
            const query = {};
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // Get single user
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        // Update User
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // Check Admin route
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await usersCollection.findOne({ email: email });
            const isAdmin = user.role === "admin";
            res.send({ admin: isAdmin });
        })
        // Make an Admin
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

// Check Server use simple API

app.get('/', (req, res) => {
    res.send('Welcome to Dreamy Electric');
});

app.listen(port, () => {
    console.log('server is running');
})
