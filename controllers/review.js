const express = require('express')
const router = express.Router()
const Review = require('../models/review')

///INDEX///
router.get('/', async (req, res) => {
    const allReviews = await Review.find({})
    res.json({
        status: 200,
        data: allReviews
    })
})

/// SHOW ///
router.get('/:id', async (req, res) => {
    const review = await Review.findById(req.params.id)
    res.json({
        status: 200,
        data: review
    })
})

/// CREATE ///
router.post('/', async (req, res) => {
    const review = await Review.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: review
    })
})

/// UPDATE ///
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