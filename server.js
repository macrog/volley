// We will declare all our dependencies here
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const gameCtrl = require('./controllers/game');

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

/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/

// fs.readdirSync(testFolder).forEach(file => {

//     // index = 0;
//     var liner = new lineByLine(testFolder + '/' + file);
//     var line;
//     var lineNumber = 0;
//     while (line = liner.next()) {
        
//         if(lineNumber === 1){
//             console.log('Line : ' + line);
//         }
//         lineNumber++;
//     }
    // console.log(index);
    // //create a read line interface with a stream
    // var lineReader = require('readline').createInterface({
    //     input: require('fs').createReadStream(testFolder + '/' + file)
    // });
    // //lineReader goes async
    // lineReader.on('line', function (line) {
    //     if(index === 1){
    //         console.log(line);
    //     }
    //     // console.log( 'index ' + index);
    //     var lineSplit = line.split(',');

    //     for(var i = 0; i < lineSplit.length; i++){
    //         if(lineSplit[i].indexOf('[') !== -1){
    //             var endIndex = lineSplit[i].indexOf(']');
    //             // console.log(lineSplit[i].substring(2, endIndex));
    //             score.push(lineSplit[i]);
    //         }
    //     }
    //     score.push(line.toLowerCase());
    //     index++;
    // });
    // //lineReader finish
    // lineReader.on('close', function(){
    //     // console.log('Finished reading files');
    //     index = 0;
    // });
// });

    

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res) => {
    res.send("Invalid page");
});

//Routing all HTTP requests to /game to game controller
app.use('/game',gameCtrl);

//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});