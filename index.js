var jwt = require('jsonwebtoken');
const cors=require('cors')
const express=require('express')
const app=express()
require('dotenv').config()
app.use(cors())
app.use(express.json())
const port=process.env.PORT||3000


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mq5kn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

const usercollection=client.db('studyweb').collection('user')
const sessionCollection=client.db('studyweb').collection('allsession')













app.post('/jwt',async(req,res)=>{
  const user=req.body
  const token=jwt.sign(user,process.env.ACESS_TOKEN_SECRET,{expiresIn:'1h'})
  res.send({token})
})

app.post('/users',async(req,res)=>{
  const user=req.body
  const query={email:user.email}
  const existinguser=await usercollection.findOne(query)
  if(existinguser){
    console.log('alredy in')
    return res.send({message:'already in'})
  }
const result=await usercollection.insertOne(user)
res.send(result)
})
// all session 
app.post('/allsession',async(req,res)=>{
  const sesstiondata=req.body
  const result= await sessionCollection.insertOne(sesstiondata)
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('mongodb connet sucess in spherel server')
})
app.listen(port,()=>{
    console.log(`StudySphere server is sunningon port ${port}`)
})