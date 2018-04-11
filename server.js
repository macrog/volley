// We will declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const gameCtrl = require('./controllers/game');
const generalCtrl = require('./controllers/general');

// Connect mongoose to our database
mongoose.connect(config.database);

//Initialize our app variable
const app = express();

//Declaring Port
const port = 3000;
//Middleware for CORS
app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res) => {
    res.send("Invalid page");
});

//Routing all HTTP requests to /game to game controller
app.use('/game',gameCtrl);

//Routing all HTTP requests to /game to game controller
app.use('/general',generalCtrl);

//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});