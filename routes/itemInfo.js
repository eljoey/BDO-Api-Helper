const express = require('express');
const router = express.Router()

router.get('/:itemKey', (req, res, next) => {
    const itemKey = req.params.itemKey

    res.send(
        `You Made a Item Detail Request for
        
        ItemKey: ${itemKey}`
    )
})

module.exports = router