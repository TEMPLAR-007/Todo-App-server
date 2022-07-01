const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkb9l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();
        const TaskCollection = client.db("todoTask").collection("task");

        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = TaskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        app.post('/task', async (req, res) => {
            const newTask = req.body;
            console.log(newTask);
            const result = await TaskCollection.insertOne(newTask);
            res.send(result);
        });

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await TaskCollection.deleteOne(query);
            res.send(result);
        });


        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedTask
            };
            const result = await TaskCollection.updateOne(filter, updatedDoc, options);

            res.send(result);
        });


        app.put('/task/done/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: { role: 'done' }
            };
            const result = await TaskCollection.updateOne(filter, updateDoc);

            res.send(result);
        });


        app.get('/donetask', async (req, res) => {
            const role = req.query.role;
            const query = { role: role };
            const cursor = TaskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);

        });


    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running node server')
});

app.listen(port, () => {
    console.log('server is running');
});