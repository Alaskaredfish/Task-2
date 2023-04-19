
const e = require('express');
const Redis= require('redis');
const axios = require('axios')
const cors = require('cors')

const redisClient = Redis.createClient()
const DEAFUALT_EXPIRATION = 3600

const app = e()

app.use(e.urlencoded({extended: true}))
app.use(cors())

// Get large amount of data 
exports.task5 = async function (req, res) {
    await redisClient.connect()
    const albumId = req.query.albumId
    redisClient.get('photos', async (error, photos) => {
        if(error) console.log(error)
        if (photos != null) {
            return res.json(JSON.parse(photos))
        } else {
            const {data} = await axios.get(
                'https://jsonplaceholder.typicode.com/photos',
                {params: {albumId}}    
            )
            redisClient.setEx('photos', DEAFUALT_EXPIRATION, JSON.stringify(data))
            res.json(data)
        }
    })
};



