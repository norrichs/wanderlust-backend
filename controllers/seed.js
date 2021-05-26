const express = require("express");
const router = express.Router();

/// import models ///
const Trip = require("../models/trip");
const Review = require("../models/review");
const Agency = require("../models/agency");
const Customer = require("../models/customer");

/// import seed data ///
const tripSeedData = require("../db/tripSeedData.json");
const reviewSeedData = require("../db/reviewSeedData.json");
const agencySeedData = require("../db/agencySeedData.json");
const customerSeedData = require("../db/customerSeedData.json");

/// clear all models and add seed data ///
router.get("/", async (req, res) => {
	try {
		await Trip.deleteMany({});
		await Review.deleteMany({});
		await Agency.deleteMany({});
		await Customer.deleteMany({});

		await Trip.create(tripSeedData);
		await Review.create(reviewSeedData);
		await Agency.create(agencySeedData);
		await Customer.create(customerSeedData);

		// get full list of places to confirm seeding worked
		const trips = await Trip.find({});
		const reviews = await Review.find({});
		const agencies = await Agency.find({});
		const customers = await Customer.find({});

		// initialize relations
		trips.forEach((trip, i) => {
			console.log('trip refs binding',i, trip.name);
			initTrip(trip.id);
		});
		customers.forEach((customer, i) => {
			console.log('customer refs binding',i, customer.name);
			initCustomer(customer.id);
		});
		agencies.forEach((agency,i)=>{
			console.log('agency refs binding',i,agency.name)
			initAgency(agency.id)
		})

		// return full list of places as JSON
		res.json({ status: 200, data: [trips, reviews, agencies, customers] });
	} catch (error) {
		// return error as JSON with an error status
		res.status(400).json(error);
	}
});

// initialize trip function
//		binds reviews to trip doc
//		binds agency to trip doc
const initTrip = async (id) => {
	console.log("trip / review and agency update");
	const trip = await Trip.findById(id);
	const reviews = await Review.find({ trip_name: trip.name }).exec();
	const agency = await Agency.findOne({ name: trip.agency }).exec();
	if (agency) {
		await Trip.findByIdAndUpdate(id, {
			$addToSet: { agencies_ref: agency.id },
		});
	}
	if (reviews.length > 0) {
		const reviewIds = reviews.map((review) => review._id);
		await Trip.findByIdAndUpdate(id, {
			$addToSet: { reviews_ref: { $each: reviewIds } },
		});
	} else {
		console.log({ status: 404, msg: "no reviews for this trip" });
	}
};

// initialize review
// 		TODO post MVP bind author to review 

// initialize agency
// 		binds offered trips to agency docs
// 		TODO post mvp - bind reviews of trips offered to agency
const initAgency = async (id) => {
	console.log("agency / trip update");
	const agency = await Agency.findById(id);
	const trips = await Trip.find({ agency: agency.name });
	if (trips.length > 0) {
		const tripIds = trips.map((trip) => trip._id);
		await Agency.findByIdAndUpdate(id, {
			$addToSet: { trips_ref: { $each: tripIds } },
		});
	} else {
		console.log({ status: 404, msg: "no trips for this agency" });
	}
};

// initialize customer
//		binds booked trips to customer doc
const initCustomer = async (id) => {
	console.log("customer / trip update");
	const customer = await Customer.findById(id);
	console.log("seed initCustomer customer", customer);
	if (customer.booked_trips.length > 0) {
		// Construct a filter from the booked trips
		const filter = {
			name: {
				$in: customer.booked_trips,
			},
		};
		// Use the filter to return matching trips
		const trips = await Trip.find(filter).exec();
		// Get all the ids in an array
		const tripIds = trips.map((trip) => trip._id);
		// push the retrieved trip ids onto the customer document
		await Customer.findByIdAndUpdate(
			id,
			{ $addToSet: { booked_trips_ref: { $each: tripIds } } },
			{ new: true }
		);
	}
};

module.exports = router;
