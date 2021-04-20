const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const fileUpload= require('express-fileupload'); 
require('dotenv').config()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const ObjectID=require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywjyr.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(process.env.DB_DATABASE).collection(process.env.DB_COLLECT);
  const bookingCollection = client.db(process.env.DB_DATABASE).collection(process.env.DB_BOOK);
  const adminCollection = client.db(process.env.DB_DATABASE).collection(process.env.DB_ADMIN);
  const reviewCollection = client.db(process.env.DB_DATABASE).collection(process.env.DB_REV);
  
  app.post('/addServices', (req, res)=> {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    console.log(title, description,file)
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    var image = {
      type: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };
    serviceCollection.insertOne({title,description,image})  
    .then(result => {
      res.send(result.insertedCount > 0);
  })
  })

  app.get('/services', (req, res)=> {
    serviceCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })

  app.delete('/delete/:id',(req,res)=>{
      const id= ObjectID(req.params.id);
      console.log('Deleting: ',id)
      serviceCollection.findOneAndDelete({_id:id})
      .then(document=>res.send(document))
  })
  
  //booking section
  app.post('/addBooking',(req,res)=>{
    const booking = req.body;
    bookingCollection.insertOne(booking)
    .then(res=>{
      console.log(res);
      res.send(res.insertedCount>0)
    })
  })

  app.get('/booking',(req,res)=>{
    bookingCollection.find()
    .toArray((err, items)=>{
      res.send(items)
    })
  })
  
  // review section
  app.post('/addreview', (req, res)=> {
    const file = req.files.file;
    const name = req.body.name;
    const designation = req.body.designation;
    const description = req.body.description;
    console.log(name, designation, description,file)
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    var image = {
      type: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };
    reviewCollection.insertOne({name, designation, description, image})  
    .then(result => {
      res.send(result.insertedCount > 0);
  })
  })

  app.get('/review',(req,res)=>{
    reviewCollection.find()
    .toArray((err, items)=>{
      res.send(items)
    })
  })

  //admin section
  app.post('/addAdmin',(req,res)=>{
    const admin = req.body;
    adminCollection.insertOne(admin)
    .then(res=>{
      console.log(res);
      res.send(res.insertedCount>0)
    })
  })

  app.get('/admins', (req, res)=> {
    adminCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })
  
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
const port = 5000
app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})