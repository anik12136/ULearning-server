const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { text } = require('express');
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.00oqpy6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const demoCourses   =  client.db("ULearning").collection("demoCourses");
        const formCourses   =  client.db("ULearning").collection("formCourses");
        const users         =  client.db("ULearning").collection("users");
        const courseRequest =  client.db("ULearning").collection("courseRequest");
        const communityPost =  client.db("ULearning").collection("community");
        const bookmarks     =  client.db("ULearning").collection("bookmarks");
        const cartCollection=  client.db("ULearning").collection("carts");


    // ----------APIs------------------------------------------------------------
        // Demo course .....api
        app.get('/demoCourses', async (req, res) => {
            const result = await demoCourses.find().toArray();
            res.send(result);
        })


     // -----------end APIs-----------------------------------------------------------





    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('ULearning is Running')
})

app.listen(port, () => {
    console.log(`ULearnings API is running on port: ${port}`)
})