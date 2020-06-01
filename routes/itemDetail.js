const express = require('express');
const router = express.Router()

router.get('/:itemKey', (req, res, next) => {
    const itemKey = req.params.itemKey

    res.send(
        `You Requested Item Detail for
        
        ItemKey: ${itemKey}`
    )
})

module.exports = router