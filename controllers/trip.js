const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const Review = require("../models/review");
const Agency = require("../models/agency");

///INDEX, populated///
router.get("/", async (req, res) => {
	Trip.find({})
		.populate("reviews_ref")
		.populate("agencies_ref")
		.exec((err, allTrips) => {
			err
				? res.json({ status: 404, msg: "no reviews for this trip" })
				: res.json({ status: 200, data: allTrips });
		});
});

///  SHOW trip with relations ///
router.get("/:id", async (req, res) => {
	console.log("trip / get populated trip data");
	// Get the trip and retrieve the associated trips
	await Trip.findById(req.params.id)
		.populate("reviews_ref")
		.populate("agencies_ref")
		.exec((err, trip) => {
			err
				? res.json({
						status: 404,
						msg: "no reviews for this trip",
						data: err,
				  })
				: res.json({ status: 200, data: trip });
		});
});

/// CREATE ///  TODO - add review and trip relations
router.post("/", async (req, res) => {
	const trip = await Trip.create(req.body);
	res.json({
		status: 200,
		msg: "data received",
		data: trip,
	});
});

/// UPDATE ///
router.put("/:id", async (req, res) => {
	const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json({
		status: 200,
		data: trip,
	});
});

/// DELETE ///
router.delete("/:id", async (req, res) => {
	await Trip.findByIdAndDelete(req.params.id);
	res.json({
		status: 200,
	});
});

/// UPDATE Bind reviews and an agency to a trip ///
router.put("/:id/addRefs", async (req, res) => {
	console.log("trip / review update");
	const trip = await Trip.findById(req.params.id);
	//  Get get all reviews by filtering for revew.trip_name
	const reviews = await Review.find({ trip_name: trip.name }).exec();
	const agency = await Agency.findOne({ name: trip.agency }).exec();
	console.log("agency listed in trip", trip.agency);
	console.log("agency id", agency.id);
	if (agency) {
		await Trip.findByIdAndUpdate(req.params.id, {
			$addToSet: { agencies_ref: agency.id },
		});
	}
	if (reviews.length > 0) {
		// Get all the ids in an array
		const reviewIds = reviews.map((review) => review._id);
		console.log("list of review ids found", reviewIds);
		// push the retrieved trip ids onto the trip document
		await Trip.findByIdAndUpdate(req.params.id, {
			$addToSet: { reviews_ref: { $each: reviewIds } },
		});
		// Populate and respond with all data
	} else {
		console.log("error, no reviews for this trip");
		res.json({ status: 404, msg: "no reviews for this trip" });
	}
	//  Respond with populated data
	//  Could be deleted, just for verification
	Trip.findById(req.params.id)
		.populate("reviews_ref")
		.populate("agencies_ref")
		.exec((err, trip) => {
			if (err) console.log("error", err);
			console.log("trip reviews");
			res.json({
				status: 200,
				data: trip,
			});
		});
});

module.exports = router;
