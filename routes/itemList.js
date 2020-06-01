const express = require('express');
const router = express.Router()

router.get('/:category/:categoryNumber', (req, res, next) => {
    const category = req.params.category
    const categoryNumber = req.params.categoryNumber

    res.send(
        `You Made a ItemList Request for
        
        Category: ${category} 
        CategoryNumber: ${categoryNumber}`
    )
    
})

module.exports = router