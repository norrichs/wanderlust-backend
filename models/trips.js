const mongoose = require('../db/connection')
const {Schema,model }= mongoose
const songSchema = new Schema({
    title: String,
    artist: String,
    time: String
},{timestamps:true}
)

                           //collections- by default will make a lowercase
const Song = model('Song',songSchema )
//export the schema 
module.exports = Song