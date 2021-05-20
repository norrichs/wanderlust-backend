const express = require('express')
const router = express.Router()
const Trips = require('../models/trips')

///GET///
router.get('/', async (req, res) => {
    const allTripss = await Trips.find({})
    res.json({
        status: 200,
        data: allTripss
    })
})

/// POST ///
router.post('/', async (req, res) => {
    const allTripss = await Trips.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: allTripss
    })
})

/// PUT ///
router.put('/:id', async (req, res) => {
    const Trips = await Trips.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({
        status: 200,
        data: Trips
    })
})

/// DELETE ///
router.delete('/:id', async (req, res) => {
    await Trips.findByIdAndDelete(req.params.id)
        res.json({
            status: 200,
        });
})


module.exports = router