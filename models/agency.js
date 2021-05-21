const mongoose = require('../db/connection')
const {Schema,model }= mongoose
const agencySchema = new Schema({
    name: String,
    contact: {
        address: String,
        phone: String,
        email: String,
        url: String
    } 
})

                           //collections- by default will make a lowercase
const Agency = model('Agency', agencySchema )
//export the schema 
module.exports = Agency