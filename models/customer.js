const mongoose = require("../db/connection");
const { Schema, model } = mongoose;
const customerSchema = new Schema({
	username: String,
	password: String,
	name: {
		first: String,
		last: String,
	},
	email: String,
	booked_trips: [String],
	booked_trips_ref: [
		{
			ref: "Trip",
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	reviews_ref: [{
	    ref: "Review",
	    type: mongoose.Schema.Types.ObjectId
	}]
});

//collections- by default will make a lowercase
const Customer = model("Customer", customerSchema);
//export the schema
module.exports = Customer;
