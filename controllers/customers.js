const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')

///GET///
router.get('/', async (req, res) => {
    const allCustomers = await Customer.find({})
    res.json({
        status: 200,
        data: allCustomers
    })
})

/// POST ///
router.post('/', async (req, res) => {
    const customer = await Customer.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: customer
    })
})

/// PUT ///
router.put('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({
        status: 200,
        data: customer
    })
})

/// DELETE ///
router.delete('/:id', async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id)
        res.json({
            status: 200,
        });
})


module.exports = router