//Require mongoose package
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Mixed = Schema.Types.Mixed;

//Define Schema
const GamelistSchema = mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    leaugue: String,
    men: Boolean,
    team1Name: {
        type: String,
        required: true
    },
    team2Name: {
        type: String,
        required: true
    },
    team1Set: {
        type: Number,
        required: true
    },
    team2Set: {
        type: Number,
        required: true
    },
    team1Points: {
        type: Number,
        required: true
    },
    team2Points: {
        type: Number,
        required: true
    },
    team1Aces: {
        type: Number,
        required: true
    },
    team2Aces: {
        type: Number,
        required: true
    },
    team1Kills: {
        type: Number,
        required: true
    },
    team2Kills: {
        type: Number,
        required: true
    },
    team1Blocks: {
        type: Number,
        required: true
    },
    team2Blocks: {
        type: Number,
        required: true
    },
    team1ServiceErrors: {
        type: Number,
        required: true
    },
    team2ServiceErrors: {
        type: Number,
        required: true
    },
    pointByPoint: {
        type: [String],
        required: true
    },
    setsFinal: {
        type: [String],
        required: true
    }
});

const GameList = module.exports = mongoose.model('GameList', GamelistSchema );

//find() returns all the lists
module.exports.getAllLists = (callback) => {
    GameList.find({}, callback);
}
//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
}
//Here we need to pass an id parameter to remove
module.exports.deleteById = (id, callback) => {
    let query = {_id: id};
    GameList.remove(query, callback);
}
//insertMany() insert multiple
module.exports.insertMultiple = (list, callback) => {
    GameList.insertMany(list, callback);
}

//remove({}) delete all objects
module.exports.deleteAll = (callback) => {
    GameList.remove({}, callback);
}

//find({}) delete all objects
module.exports.findByScore = (param, callback) => {
    var string =  param.home + ':' + param.away;
    GameList.find({ 'pointByPoint': { '$all': [ string ] } }, callback);
}

//find({}) delete all objects
module.exports.getSets = (id, callback) => {
    GameList.find({"_id" : id}, {pointByPoint: 1}, callback);
}


//-------------------------------------GENERAL-----------------------------------------//
//distinct() returns unique values of a field in DB
module.exports.getCountriesList = (callback) => {
    GameList.distinct('location' ,callback);
}