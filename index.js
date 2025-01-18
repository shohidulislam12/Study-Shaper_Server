var jwt = require('jsonwebtoken');
const cors=require('cors')
const express=require('express')
const app=express()
require('dotenv').config()
app.use(cors())
app.use(express.json())
const port=process.env.PORT||3000


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
//all users
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
//all useres get 
app.get('/users',async(req,res)=>{
  const search=req.query.search
  console.log(search)

  let query={
    $or: [
      {name:{$regex:search,$options:'i'}},
      {email:{$regex:search,$options:'i'}}
    ]
  }
  const result=await usercollection.find(query).toArray()
  res.send(result)
})
//update useres 
app.patch('/updateuserole/:email',async(req,res)=>{
const email=req.params.email
const {role}=req.body
const query={email}
const updateDoc={
  $set:{role:role}
}
console.log(role)
  const result=await usercollection.updateOne(query,updateDoc)
  res.send(result)
})
// all session 
app.post('/allsession',async(req,res)=>{
  const sesstiondata=req.body
  const result= await sessionCollection.insertOne(sesstiondata)
  res.send(result)
})
app.get('/allsession',async(req,res)=>{
  const result=await sessionCollection.find().toArray()
  res.send(result)
})
app.get('/allsession/:email',async(req,res)=>{
  const email=req.params.email
  const query ={
    tutorEmail:email
    }
  const result=await sessionCollection.find(query).toArray()
  res.send(result)
})
// update status session
app.patch('/updatestatus/:id',async(req,res)=>{
  const id=req.params.id
  const {status}=req.body
  const query ={
    _id: new ObjectId(id)
    }
    const updateDoc={
      $set:{status:status}
    }
    console.log(status)
  const result=await sessionCollection.updateOne(query,updateDoc)
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