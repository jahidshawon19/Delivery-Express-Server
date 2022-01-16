const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

//MIDDLEWERE 
app.use(cors())
app.use(express.json())





// DATABASE CONNECTION START 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yfcy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {

        await client.connect()
        const database = client.db('delivery_express')
        const bookingCollection = database.collection('booking')
        const userCollection = database.collection('users')
        


        // POST API FOR ADDING BOOKING
        app.post('/bookings', async (req, res )=>{
            const bookingData = req.body 
            const result = await bookingCollection.insertOne(bookingData)
            res.json(result)
        })

        //GET API FOR FETCH BOOKING DATA FOR SPECIFIC USER BASED ON EMAIL 
        app.get('/bookings', async (req, res) =>{
            const email= req.query.email 
            const query = {senderEmail:email}
           
            const cursor = bookingCollection.find(query)
            const bookings = await cursor.toArray()
            res.json(bookings)
        })


        // POST API TO ADD USER TO THE DATABASE
        app.post('/users', async (req, res) =>{
            const userData = req.body 
            const result = await userCollection.insertOne(userData)
            res.json(result)
        })

        //GET API FOR FETCH USERS FROM DATABASE 
        app.get('/users', async (req, res) =>{
            const cursor = userCollection.find({})
            const allUsers = await cursor.toArray()
            res.json(allUsers)
        })


        // PUT API FOR MAKE ADMIN 

        app.put('/users/admin', async (req, res) =>{
            const user = req.body 
            const filter = {email: user.email}
            const updateDoc = {$set: {role:'admin'}}
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        app.get('/users/:email', async (req, res) =>{
            const email = req.params.email 
            const query = {email:email}
            const user = await userCollection.findOne(query)
            let isAdmin = false 
            if(user?.role === 'admin'){
                isAdmin=true
            }
            res.json({admin: isAdmin})
        })
  


    } finally {
        // await client.close()
    }
}

run().catch(console.dir())

// DATABASE CONNECTION END


app.get('/', (req, res) => {
    res.send('<h1>Delivery Express Server Running...</h1>')
})

app.listen(port, () => {
    console.log("Running Server on The Port", port)
})