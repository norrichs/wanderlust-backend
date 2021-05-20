const express = require('express')
const router = express.Router()
const Song = require('../models/song')

///GET///
router.get('/', async (req, res) => {
    const allSongs = await Song.find({})
    res.json({
        status: 200,
        data: allSongs
    })
})

/// POST ///
router.post('/', async (req, res) => {
    const allSongs = await Song.create(req.body)
    res.json({
        status: 200,
        msg: "data received",
        data: allSongs
    })
})

/// PUT ///
router.put('/:id', async (req, res) => {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json({
        status: 200,
        data: song
    })
})

/// DELETE ///
router.delete('/:id', async (req, res) => {
    await Song.findByIdAndDelete(req.params.id)
        res.json({
            status: 200,
        });
})


module.exports = router