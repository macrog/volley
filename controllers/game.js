//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();

const lineByLine = require('n-readlines');
const testFolder = 'data';
const fs = require('fs');
const gameMdl = require('../models/game');
const gameSchema = require('../models/schema');
const tools = require('./helper');


//GET HTTP method to /game
router.get('/',(req, res) => {
    gameMdl.getAllLists((err, lists)=> {
        if(err) {
            res.json({success: false, message: `Failed to load from DB. Error: ${err}`});
        }else {
            res.json({list: lists, numberFiles: lists.length});
        }
    });
});

//POST
router.post('/', (req,res,next) => {

    var game = tools.mapGame(req.body);

    gameMdl.addList(game, (err, list) => {
        if(err) {
            res.json({success: false, message: `Failed to add item. Error: ${err}`});
        }else {
            res.json({success: true, message: "Added successfully."});
        }

    });
});

//DELETE HTTP method to /gameMdl. Here, we pass in a param which is the object id.
router.delete('/delete/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    gameMdl.deleteById(id, (err, list) => {
        if (err) {
            return res.json({success: false, msg: 'Cannot remove item'});
        }

        if (list.nMatched === 0) {
            return res.status(404).json({success: false, msg: 'User not found'});
        }
        else if(list) {
            res.json({success: true, message: "Deleted successfully"});
        }
        else
            res.json({success: false});
    })
});

//DELETE HTTP method to /gameMdl. Here, we pass in a param which is the object id.
router.delete('/delete', (req, res, next) => {

    //Call the model method deleteListById
    gameMdl.deleteAll((err, list) => {
        if(err) {
            res.json({success: false, message: `Failed to delete all elements. Error: ${err}`});
        }
        else if(list) {
            res.json({success: true, message: "Deleted successfully"});
        }
        else
            res.json({success: false});
    })
});

//read file
router.get('/read', (req, res, next)=> {

    // read local data folder content 
    readLocalDataContent()
        .then(allLocalGAmes => {
            return uploadGames(allLocalGAmes);
        })
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            console.log('error!!!');
        });
});

//upload file
router.post('/upload', (req, res, next)=> {
    let newList = [];

    req.body.forEach(gameObj => {
        let game = tools.mapGame(gameObj);
        newList.push(game);
    });

    gameMdl.insertMultiple(newList, (err) => {
        if(err) {
            res.json({success: false, message: `Failed to add multiple items. Error: ${err}`});
        }
        else {
            res.json({success:true, message: "Added successfully."});
        }
    });


});

//find games
router.get('/find/:data', (req, res, next)=> {
    let params = JSON.parse(req.params.data);

    gameMdl.findGamesWhere(params, (err, lists) => {
        if(err) {
            res.json({success: false, message: `Failed to find items. Error: ${err}`});
        }
        else {
            let points = null;
            let set = null;
            if(params.home !== null && params.away !== null) {
                points =  params.home + ':' + params.away;
            }
            params.set !== null ? set = params.set : null;

            var stats = tools.getStats(lists, points, set);
            stats.sort( (a, b) => {
                if(a.count > b.count)
                    return -1;
                else
                    return 1;
            });
            res.json({list: lists, numberFiles: lists.length, stats: stats});
        }
    });
});

//GET sets per game object
router.get('/sets/:id', (req, res, next) => {
    //access the parameter which is the id of the item to be deleted
    let id = req.params.id;
    //Call the model method deleteListById
    gameMdl.getSets(id, (err, list) => {
        if(err) {
            res.json({success: false, message: `Failed to load from DB. Error: ${err}`});
        }else {
            var arrayIndex = [];
            var sets = [];
            var points = list[0].stes.slice(0);
            list[0].sets.forEach((element, index) => {
                if(element === "1 : 0" || element === "0 : 1"){
                    arrayIndex.push(index);
                }
            });
            arrayIndex.forEach((value, index) => {
                var set = [];
                var first = value;
                var last;
                if(index !== arrayIndex.length - 1){
                    last = arrayIndex[index + 1];
                }else{
                    last = points.length;
                }
                if(!last) last = points.length;

                for(var i = first; i < last; i++){
                    set.push(points[i]);
                }
                sets.push(set);
            });

            res.json(sets);
        }
    })
});

function uploadGames(allLocalGamesObj) {
    
    return new Promise((resolve, reject) => {
        let newList = [];

        allLocalGamesObj.list.forEach(gameObj => {
            let game = tools.mapGame(gameObj);
            newList.push(game);
        });

        gameMdl.insertMultiple(newList, (err) => {
            if(err) {
                reject({success: false, message: `Failed to add multiple items. Error: ${err}`});
            }
            else {
                resolve({list: [], numberFiles: allLocalGamesObj.numberFiles});
            }
        });
    });
}

function readLocalDataContent() {

    return new Promise((resolve, reject) => {
        var games = [];

        let numberFiles = 0;
        let fileGlobal = '';
        const notCsvFiles = [];
        try {       
        
            fs.readdirSync(testFolder).forEach(file => {
                fileGlobal = file;
                if (file.split('.')[1].toLocaleLowerCase() === 'csv') {
                    let game = new gameSchema();
                    numberFiles++;
                    var liner = new lineByLine(testFolder + '/' + file);
                    var line;
                    var lineNumber = 0;
                    var points = [];
                    var regexSenior = RegExp('U[0-9]{2}|student');
                    var regexMale = RegExp('women');
                    while (line = liner.next()) {
                        var lineSplit = line.toString().split(',');
    
                        if(lineNumber === 1){
                            game.location = removeFirstAndLast(lineSplit[1]);
                            game.leaugue = removeFirstAndLast(lineSplit[2]);
                            game.isMale = regexMale.test(game.leaugue) ? false : true;
                            game.team1Name = removeFirstAndLast(lineSplit[4]);
                            game.team2Name = removeFirstAndLast(lineSplit[5]);
                            game.isSenior = regexSenior.test(game.team1Name) ? false : true;
                        }else if(lineNumber === 3){
                            game.team1Set = removeFirstAndLast(lineSplit[1]);
                            game.team2Set = removeFirstAndLast(lineSplit[3]);
                        }else if(lineNumber === 4){
                            game.team1Points = removeFirstAndLast(lineSplit[1]);
                            game.team2Points = removeFirstAndLast(lineSplit[3]);
                        }else if(lineNumber === 6){
                            game.team1Aces = removeFirstAndLast(lineSplit[1]);
                            game.team2Aces = removeFirstAndLast(lineSplit[3]);
                        }else if(lineNumber === 7){
                            game.team1ServiceErrors = removeFirstAndLast(lineSplit[1]);
                            game.team2ServiceErrors = removeFirstAndLast(lineSplit[3]);
                        }else if(lineNumber === 8){
                            game.team1Kills = removeFirstAndLast(lineSplit[1]);
                            game.team2Kills = removeFirstAndLast(lineSplit[3]);
                        }else if(lineNumber === 9){
                            game.team1Blocks = removeFirstAndLast(lineSplit[1]);
                            game.team2Blocks = removeFirstAndLast(lineSplit[3]);
                        }
    
                        for(var i = 0; i < lineSplit.length; i++){
                            if(lineSplit[i].indexOf('[') !== -1){
                                var endIndex = lineSplit[i].indexOf(']');
                                points.push(lineSplit[i].substring(2, endIndex).replace(/\s/g,''));
                            }
                        }
    
                        lineNumber++;
                    }
                    game.setsAll = points;
                    game.sets = tools.getSetsPoitns(points);
                    game.setsFinal = tools.getSetsFinalPoints(game.sets);
    
                    games.push(game);
                } else {
                    notCsvFiles.push(file);
                }
            });
            
        } catch (error) {
            console.log('FILE: ' + fileGlobal);
            console.log('|--------------------  ERROR  --------------------|');
            console.log(JSON.stringify(error));
            reject(error);
        }
    
        if (notCsvFiles.length > 0) {
            console.log('|--------------------  FILES NOT CSV TYPE FOUND  --------------------|');
            console.log(notCsvFiles);
        }

        resolve({list: games, numberFiles: numberFiles});
    });    
}

function removeFirstAndLast(string){
    return string.substring(1, string.length-1)
}

module.exports = router;