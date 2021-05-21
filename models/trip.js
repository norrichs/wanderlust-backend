const mongoose = require('../db/connection')
const {Schema,model }= mongoose

const tripSchema = new Schema({
    name: String,
    photo: String,
    description: String,
    activities: String,
    cost: String
})

                           //collections- by default will make a lowercase
const Trip = model('Trip', tripSchema)
//export the schema 
module.exports = Trip