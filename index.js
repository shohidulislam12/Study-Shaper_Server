var jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
const stripe = require("stripe")(process.env.STRIPE_KYE);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mq5kn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usercollection = client.db("studyweb").collection("user");
    const sessionCollection = client.db("studyweb").collection("allsession");
    const notescollection = client.db("studyweb").collection("notes");
    const materialscollection = client.db("studyweb").collection("materials");
    const bookedcollection = client.db("studyweb").collection("booked");
    const reviewcollection = client.db("studyweb").collection("review");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });
    //all users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existinguser = await usercollection.findOne(query);
      if (existinguser) {
        console.log("alredy in");
        return res.send({ message: "already in" });
      }
      const result = await usercollection.insertOne(user);
      res.send(result);
    });
    //all useres get
    app.get("/users", async (req, res) => {
      const search = req.query.search || "";
      console.log(search);

      let query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
      const result = await usercollection.find(query).toArray();
      res.send(result);
    });
    //update useres
    app.patch("/updateuserole/:email", async (req, res) => {
      const email = req.params.email;
      const { role } = req.body;
      const query = { email };
      const updateDoc = {
        $set: { role: role },
      };
      console.log(role);
      const result = await usercollection.updateOne(query, updateDoc);
      res.send(result);
    });
    // all session
    app.post("/allsession", async (req, res) => {
      const sesstiondata = req.body;
      const result = await sessionCollection.insertOne(sesstiondata);
      res.send(result);
    });
    app.get("/allsession", async (req, res) => {
      const result = await sessionCollection.find().toArray();
      res.send(result);
    });
    app.get("/allsession/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        tutorEmail: email,
      };
      const result = await sessionCollection.find(query).toArray();
      res.send(result);
    });
    //get single data for session
    app.get("/session/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sessionCollection.findOne(query);

      res.send(result);
    });
    // update status session
    app.patch("/updatestatus/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const { type } = req.body;
      const { registrationFee } = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const updateDoc = {
        $set: { status: status, registrationFee: registrationFee },
      };
      console.log(status);
      const result = await sessionCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    //creat note
    app.post("/creatnote", async (req, res) => {
      const note = req.body;
      const result = await notescollection.insertOne(note);
      res.send(result);
    });
    //creat note
    app.get("/getnote/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };

      const result = await notescollection.find(query).toArray();
      res.send(result);
    });
    //delete note
    app.delete("/deletenote/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await notescollection.deleteOne(query);
      res.send(result);
    });
    //get note by id
    app.get("/getssnote/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await notescollection.findOne(query);
      res.send(result);
    });
    //update notes
    app.patch("/updatenote/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: data.title,
          description: data.description,
        },
      };

      const result = await notescollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // all material
    app.post("/allmaterial", async (req, res) => {
      const materail = req.body;
      const result = await materialscollection.insertOne(materail);
      res.send(result);
    });
    app.get("/allmaterialadmin", async (req, res) => {
    
      const result = await materialscollection.find().toArray();
      res.send(result);
    });
    //get material
    app.get("/allmaterial/:email", async (req, res) => {
      const email = req.params.email;
      const query = { teacherEmail: email };
      const result = await materialscollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/deletematerial/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await materialscollection.deleteOne(query);
      res.send(result);
    });
    //get id material
    app.get("/editmaterial/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await materialscollection.findOne(query);
      res.send(result);
    });
    app.put("/materialUpdate/:id", async (req, res) => {
      const materail = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: materail,
      };
      const result = await materialscollection.updateOne(query, updateDoc);
      res.send(result);
    });
    //creat payment intent
    app.post("/creatpayment-intent", async (req, res) => {
      const { sessionid, registrationFee } = req.body;

      if (!registrationFee) {
        return;
      }
      const registrationFee2 = parseInt(registrationFee);
      const sessionFee = registrationFee2 * 100; // Update 'sessionFee'
      const { client_secret } = await stripe.paymentIntents.create({
        amount: sessionFee,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({ client_secret: client_secret });
    });

    //store boking data from student
    app.post("/booked-data", async (req, res) => {
      const bookdata = req.body;
      const result = await bookedcollection.insertOne(bookdata);
      res.send(result);
      console.log(result);
    });
    app.get("/booked-data", async (req, res) => {
      const result = await bookedcollection.find().toArray();
      res.send(result);
      console.log(result);
    });
    // get booking data by email
    app.get("/bookingdata/:email", async (req, res) => {
      const email = req.params.email;
      const query = { studentEmail: email };
      const result = await bookedcollection.find(query).toArray();
      res.send(result);
    });
    //get study note by session id
    // app.get('/booked-studynote/:email',async(req,res)=>{
    //   const email=req.params.email
    //   const query={studentEmail:email}
    //  const myresult=await bookedcollection.find(query).toArray()

    //  const sessionIds = myresult.map(session => session. sessionId);

    //  const studyMaterials = await materialscollection.find({
    //   sessionId: { $in: sessionIds }
    // }).toArray();

    // console.log(studyMaterials)
    // res.send(studyMaterials)

    // })
    app.get("/booked-studynote/:email", async (req, res) => {
      const email = req.params.email;
      const query = { studentEmail: email };
      const result = await bookedcollection
        .aggregate([
        

          {
            $lookup: {
              from: "materials", // Name of the target collection
              localField: "sessionId", // Field in booked collection
              foreignField: "sessionId", // Field in studyMaterial collection
              as: "materials", // Name of the joined array
            },
          },
        ])
        .toArray();

      res.send(result);
    });

//reviw collection
app.post('/review',async(req,res)=>{
  const reviewData=req.body
  const result=await reviewcollection.insertOne(reviewData)
  res.send(result)
})
app.get('/reviews/:id',async(req,res)=>{
  
  const id = req.params.id;
  const filter = {sessionId: id };
  const result=await reviewcollection.find(filter).toArray()
  console.log(id)
  res.send(result)
})







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("mongodb connet sucess in spherel server");
});
app.listen(port, () => {
  console.log(`StudySphere server is sunningon port ${port}`);
});
