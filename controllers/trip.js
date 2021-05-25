const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const Review = require("../models/review");

///INDEX///
router.get("/", async (req, res) => {
	const allTrips = await Trip.find({});
	res.json({
		status: 200,
		data: allTrips,
	});
});

/// SHOW ///
router.get("/:id", async (req, res) => {
	const trip = await Trip.findById(req.params.id);
	res.json({
		status: 200,
		data: trip,
	});
});

/// CREATE ///
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

///  SHOW trip->review relations ///
router.get("/:id/reviews", async (req, res) => {
	console.log("trip / get populated trip data");
	// Get the trip and retrieve the associated trips
	await Trip.findById(req.params.id)
		.populate("reviews_ref")
		.exec((err, trip) => {
			if (err) {
				console.log(err);
				res.json({ status: 404, msg: "no reviews for this trip" });
			} else {
				console.log("trips");
				res.json({
					status: 200,
					data: trip,
				});
			}
		});
});

/// UPDATE Bind reviews to a trip ///
router.put("/:id/addReviews", async (req, res) => {
	console.log("trip / review update");
	const trip = await Trip.findById(req.params.id);
	//  Get get all reviews by filtering for revew.trip_name
	const reviews = await Review.find({ trip_name: trip.name }).exec();
	console.log("reviews", reviews)
	if (reviews.length > 0) {
		// Get all the ids in an array
		const reviewIds = reviews.map((review) => review._id);
		console.log("list of review ids found", reviewIds)
		// push the retrieved trip ids onto the trip document
		await Trip.findByIdAndUpdate(req.params.id, {
			$addToSet: { reviews_ref: { $each: reviewIds } },
		});
		// Populate and respond with all data
		await Trip.findById(req.params.id)
			.populate("reviews_ref")
			.exec((err, trip) => {
				if (err) console.log("error", err);
				console.log("trip reviews");
				res.json({
					status: 200,
					data: trip,
				});
			});
	}else{
		console.log("error, no reviews for this trip")
		res.json({status: 404, msg: "no reviews for this trip"})
	}
});
module.exports = router;
