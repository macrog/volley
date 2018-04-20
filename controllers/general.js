const express = require('express');
const router = express.Router();

const generalMdl = require('../models/general');

//GET HTTP method to /game
router.get('/country',(req, res) => {
    generalMdl.getUniqueCountriesList((err, lists)=> {
        if(err) {
            res.json({success: false, message: `Failed to load from DB. Error: ${err}`});
        }else {
            lists = lists.sort();
            lists.unshift('');
            res.json(lists.sort());
        }   
    });
});

module.exports = router;