const express = require('express');
const router = express.Router()

router.get('/:mainKey/:subKey', (req, res, next) => {
    // I am assuming that keyType and isUp NEVER change.
    const mainKey = req.params.mainKey
    const subKey = req.params.subKey


    res.send(
        `You Made a Item Pricing Request for
        
        keyType: 0,
        mainKey: ${mainKey},
        subKey: ${subKey},
        isUp: true`
    )
})

module.exports = router
