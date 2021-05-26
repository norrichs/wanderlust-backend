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
			console.log(i, trip.name);
			initTrip(trip.id);
		});
		customers.forEach((customer, i) => {
			console.log(i,customer.name);
			initCustomer(customer.id);
		});

		// return full list of places as JSON
		res.json({ status: 200, data: [trips, reviews, agencies, customers] });
	} catch (error) {
		// return error as JSON with an error status
		res.status(400).json(error);
	}
});

// initialize trip function
const initTrip = async (id) => {
	console.log("trip / review update");
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
// TODO when relations set up

// initialize agency
// TODO when relations set up

// initialize customer function
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
