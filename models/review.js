const mongoose = require('../db/connection')
const {Schema,model }= mongoose
const reviewSchema = new Schema({
    author: String,
    body: String,
    stars: Number,
    trip_name: String,
    trips_ref: [{
        ref: "Trip",
        type: mongoose.Schema.Types.ObjectId
    }],
    customers_ref: [{
        ref: "Customer",
        type: mongoose.Schema.Types.ObjectId
    }]
}
)

                           //collections- by default will make a lowercase
const Review = model('Review', reviewSchema )
//export the schema 
module.exports = Review