const express = require('express');
const router = express.Router();

router.get('/:productId', (req, res) => {
    return res.send('Product router')
});

router.post('/', (req, res) => {

})

module.exports = router;