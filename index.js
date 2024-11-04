const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 7000;
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


      // formCourses courses that are posted by instructors ....api
      app.get('/formCourses', async (req, res) => {
          const result = await formCourses.find().toArray();
          res.send(result);
      })

      // insert courses to database from instructor
      app.post('/formCourses', async (req, res) => {
          const newFormCourses = req.body;
          // console.log(newFormCourses);
          const result = await formCourses.insertOne(newFormCourses);
          res.send(result);
      })

      // insert users to database from instructor
      app.post('/users', async (req, res) => {
          const newUser = req.body;
          const query = { email: newUser.email }
          const existingUser = await users.findOne(query);

          if (existingUser) {
              return res.send({ message: 'user already exists' })
          }
          // console.log(newFormCourses);
          const result = await users.insertOne(newUser);
          res.send(result);
      })

      // All bookMarks 
      app.get('/bookMarks', async (req, res) => {
          const result = await bookmarks.find().toArray();
          res.send(result);
      })
      // insert bookmarks to database from instructor
      app.post('/bookmarks', async (req, res) => {
          const newBookmark = req.body;
          console.log(newBookmark);
          const query = { idEmail: newBookmark.idEmail }
          const existingBookmark = await bookmarks.findOne(query);

          if (existingBookmark) {
              return res.send({ message: 'bookmark already exists' })
          }
          // console.log(newFormCourses);
          else {
              const result = await bookmarks.insertOne(newBookmark);
              res.send(result);
          }
      })

      // get bookmarks using useEffect
      app.get('/bookmarks/:email', async (req, res) => {
          const email = req.params.email;
          const result = await bookmarks.find({ email: email }).toArray();
          res.send(result);
      });

      // one bookmark carts api using tanstack query
      app.get('/bookmarks', async (req, res) => {
          const email = req.query.email;
          const query = { email: email }
          const result = await bookmarks.find(query).toArray();
          res.send(result);
      });

      // delete bookmark
      app.delete('/bookmarks/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await bookmarks.deleteOne(query);
          res.send(result);
      })

      // insert course request to database from instructor
      app.post('/courseRequest', async (req, res) => {
          const newCourse = req.body;
          const result = await courseRequest.insertOne(newCourse);
          res.send(result);
      })

      // courseRequest 
      app.get('/courseRequest', async (req, res) => {
          const result = await courseRequest.find().toArray();
          res.send(result);
      })


      // insert communityPost to database from instructor
      app.post('/communityPost', async (req, res) => {
          const newPost = req.body;
          const result = await communityPost.insertOne(newPost);
          res.send(result);
      })

      // communityPost 
      app.get('/communityPost', async (req, res) => {
          const result = await communityPost.find().toArray();
          res.send(result);
      })

      // get users ....api
      app.get('/users', async (req, res) => {
          const result = await users.find().toArray();
          res.send(result);
      })

      // only one user api
      app.get('/users/:email', async (req, res) => {
          const email = req.params.email;
          const result = await users.find({ email: email }).toArray();
          res.send(result);
      });

      // only one instructor class
      app.get('/formCourses/:email', async (req, res) => {
          const email = req.params.email;
          const result = await formCourses.find({ email: email }).toArray();
          res.send(result);
      });

      // only one user api BY ID
      app.get('/users/:id', async (req, res) => {
          const id = req.params.id;
          const result = await users.find({ _id: id }).toArray();
          res.send(result);
      });
      // only one user api BY EMAIL
      app.get('/users/:email', async (req, res) => {
          const email = req.params.email;
          const result = await users.find({ email: email }).toArray();
          // const result = await users.find({ email: email })
          res.send(result);
      });

      //    make instructor 
      app.put("/users/:email", async (req, res) => {
          const email = req.params.email;
          const body = 'instructor';
          console.log(email, body);
          const filter = { email: email };
          const updateUser = {
              $set: {
                  role: body,
              },
          };
          const result = await users.updateOne(filter, updateUser);
          // console.log(result)
          res.send(result);
      });

      // cart collection apis
      // app.get('/carts', async (req, res) => {
      //     const email = req.query.email;

      //     if (!email) {
      //         res.send([]);
      //     }

      //     const decodedEmail = req.decoded.email;
      //     if (email !== decodedEmail) {
      //         return res.status(403).send({ error: true, message: 'forbidden access' })
      //     }

      //     const query = { email: email };
      //     const result = await cartCollection.find(query).toArray();
      //     res.send(result);
      // });


      // app.post('/carts', async (req, res) => {
      //     const item = req.body;
      //     const result = await cartCollection.insertOne(item);
      //     res.send(result);
      // })

      // it will be change for better functionality


      app.post('/carts', async (req, res) => {
          const newCart = req.body;
          // console.log(newCart);
          const query = { idEmail: newCart.idEmail }
          const existingCart = await cartCollection.findOne(query);

          if (existingCart) {
              return res.send({ message: 'Cart already exists' })
          }
          // console.log(newFormCourses);
          else {
              const result = await cartCollection.insertOne(newCart);
              res.send(result);
          }
      })

      // One User Cart using use effect
      app.get('/carts/:email', async (req, res) => {
          const email = req.params.email;
          const result = await cartCollection.find({ email: email }).toArray();
          res.send(result);
      });

      // one user carts api using tanstack query
      app.get('/carts', async (req, res) => {
          const email = req.query.email;
          const query = { email: email }
          const result = await cartCollection.find(query).toArray();
          res.send(result);
      });

      // cart delete
      app.delete('/carts/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await cartCollection.deleteOne(query);
          res.send(result);
      })

      // create payment intent
      app.post('/create-payment-intent', async (req, res) => {
          const { price } = req.body;
          const amount = parseInt(price * 100);
          const paymentIntent = await stripe.paymentIntents.create({
              amount: amount,
              currency: 'usd',
              payment_method_types: ['card']
          });

          res.send({
              clientSecret: paymentIntent.client_secret
          })
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