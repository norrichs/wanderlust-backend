const mongoose = require('../db/connection')
const {Schema,model }= mongoose
const userSchema = new Schema({
    username: {type:String,required:true,unique:true},
    password:{type: String,require:true,}
},{timestamps:true}
)

                           //collections- by default will make a lowercase
const User = model('User',userSchema )
//export the schema 
module.exports = User