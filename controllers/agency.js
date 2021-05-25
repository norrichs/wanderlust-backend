const express = require('express')
const router = express.Router()
const Agency = require('../models/agency')

///GET///
router.get('/', async (req, res) => {
    const allAgencies = await Agency.find({})
    res.json({
        status: 200,
        data: allAgencies
    })
})

/// SHOW ///
router.get('/:id', async (req, res) => {
    const agency = await Agency.findById(req.params.id)
    res.json({
        status: 200,
        data: agency
    })
})

/// POST ///
router.post('/', async (req, res) => {
    const agency = await Agency.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: agency
    })
})

/// PUT ///
router.put('/:id', async (req, res) => {
    const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({
        status: 200,
        data: agency
    })
})

/// DELETE ///
router.delete('/:id', async (req, res) => {
    await Agency.findByIdAndDelete(req.params.id)
        res.json({
            status: 200,
        });
})

module.exports = router