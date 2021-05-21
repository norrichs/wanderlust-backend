const mongoose = require('../db/connection')
const {Schema,model }= mongoose
const reviewSchema = new Schema({
    author: String,
    body: String,
    stars: Number
}
)

                           //collections- by default will make a lowercase
const Review = model('Review', reviewSchema )
//export the schema 
module.exports = Review