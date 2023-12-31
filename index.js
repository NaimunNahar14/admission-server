const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()



app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdjlwie.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const classCollection = client.db('EnrollGeniusbd').collection('classes');
    const reviewCollection = client.db('EnrollGeniusbd').collection('reviews');
    const admissionCollection = client.db('EnrollGeniusbd').collection('admission');

    

    app.get('/class', async(req,res)=>{
        const result = await classCollection.find().toArray();
        res.send(result);
    })

    app.get("/class/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await classCollection.findOne({
          _id: new ObjectId(req.params.id),
      });
      res.send(result);
  })
  app.get('/review', async(req,res)=>{
    const result = await reviewCollection.find().toArray();
    res.send(result);
})

app.post('/admission', async (req, res) => {
  const admission = req.body;
  console.log(admission);
  
  try {
      const result = await admissionCollection.insertOne(admission);
      res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
      console.error('Error inserting admission:', error);
      res.status(500).json({ error: 'Failed to insert admission.' });
  }
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req, res)=>{
    res.send("admission running")
})


app.listen(port, () =>{
    console.log(`admission Api is running port: ${port}`)
})