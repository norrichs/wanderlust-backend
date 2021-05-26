const express = require("express");
const router = express.Router();
const Agency = require("../models/agency");
const Trip = require("../models/trip")

///INDEX///
router.get("/", async (req, res) => {
	await Agency.find({})
		.populate("trips_ref")
		.exec((err, allAgencies) => {
			if (err) {
				console.log(err);
				res.json({ status: 404, msg: "no agencies?" });
			}
			console.log("agencies", allAgencies);
			res.json({
				status: 200,
				data: allAgencies,
			});
		});
});

///  SHOW ///
//      shows a single agency, with populated trip references
router.get("/:id", async (req, res) => {
	console.log("agency / show populated references");
	// Get the customer and retrieve the associated trips
	await Agency.findById(req.params.id)
		.populate("trips_ref")
		.exec((err, agency) => {
			if (err) {
				console.log(err);
				res.json({ status: 404, msg: "no booked trips" });
			}
			console.log("agency", agency);
			res.json({
				status: 200,
				data: agency,
			});
		});
});

/// POST ///
router.post("/", async (req, res) => {
	const agency = await Agency.create(req.body);
	res.json({
		status: 200,
		msg: "data received",
		data: agency,
	});
});

/// UPDATE ///
router.put("/:id", async (req, res) => {
	const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json({
		status: 200,
		data: agency,
	});
});

/// DELETE ///
router.delete("/:id", async (req, res) => {
	await Agency.findByIdAndDelete(req.params.id);
	res.json({
		status: 200,
	});
});

/// UPDATE - INITIALIZE ///
//      bind offered trips to agency
router.put("/:id/addRefs", async (req, res) => {
	console.log("agency / trip update");
	const agency = await Agency.findById(req.params.id);
	const trips = await Trip.find({ agency: agency.name });
	if (trips.length > 0) {
		const tripIds = trips.map((trip) => trip._id);
		await Agency.findByIdAndUpdate(req.params.id, {
			$addToSet: { trips_ref: { $each: tripIds } },
		});
	} else {
		console.log({ status: 404, msg: "no trips for this agency" });
	}
});
module.exports = router;
