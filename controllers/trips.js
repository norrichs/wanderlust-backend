const express = require('express')
const router = express.Router()
const Trip = require('../models/trip')

///GET///
router.get('/', async (req, res) => {
    const allTrips = await Trip.find({})
    res.json({
        status: 200,
        data: allTrips
    })
})

/// POST ///
router.post('/', async (req, res) => {
    const trip = await Trip.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: trip
    })
})

/// PUT ///
router.put('/:id', async (req, res) => {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({
        status: 200,
        data: trip
    })
})

/// DELETE ///
router.delete('/:id', async (req, res) => {
    await Trip.findByIdAndDelete(req.params.id)
        res.json({
            status: 200,
        });
})


module.exports = router