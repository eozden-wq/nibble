const express = require('express');;
const router = express.Router();

router.get('/get', (req,res) => {
    res.send('test');
});

module.exports = router;