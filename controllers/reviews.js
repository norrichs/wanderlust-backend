const express = require('express')
const router = express.Router()
const Review = require('../models/review')

///GET///
router.get('/', async (req, res) => {
    const allReviews = await Review.find({})
    res.json({
        status: 200,
        data: allReviews
    })
})

/// POST ///
router.post('/', async (req, res) => {
    const review = await Review.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: review
    })
})

/// PUT ///
router.put('/:id', async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({
        status: 200,
        data: review
    })
})

/// DELETE ///Reviews
router.delete('/:id', async (req, res) => {
    await Review.findByIdAndDelete(req.params.id)
        res.json({
            status: 200,
        });
})


module.exports = router