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
