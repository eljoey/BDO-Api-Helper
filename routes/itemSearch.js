const express = require('express');
const router = express.Router()

router.get('/:searchText', (req, res, next) => {
    const searchText = req.params.searchText

    res.send(
        `You made a Item Search Request for
        
        searchText: ${searchText}`
    )
})

module.exports = router