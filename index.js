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