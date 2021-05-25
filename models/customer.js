const mongoose = require('../db/connection')
const {Schema,model }= mongoose
const customerSchema = new Schema({
    username: String,
    password: String,
    name: {
        first: String,
        last: String
    },
    email: String,
    booked_trips: [{
        ref: "Trip",
        type: mongoose.Schema.Types.ObjectId
    }],
    reviews: [{
        ref: "Review",
        type: mongoose.Schema.Types.ObjectId
    }]
})

                           //collections- by default will make a lowercase
const Customer = model('Customer', customerSchema )
//export the schema 
module.exports = Customer