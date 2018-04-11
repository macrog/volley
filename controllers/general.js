//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();

const gamelist = require('../models/game');

//GET HTTP method to /game
router.get('/country',(req, res) => {
    gamelist.getCountriesList((err, lists)=> {
        if(err) {
            res.json({success: false, message: `Failed to load from DB. Error: ${err}`});
        }else {
            res.json(lists.sort());
        }   
    });
});

module.exports = router;