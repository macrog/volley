const GameList = require('./schema');

//distinct() returns unique values of a field in DB
module.exports.getUniqueCountriesList = (callback) => {
    GameList.distinct('location' ,callback);
}

//distinct() returns unique values of a field in DB
module.exports.getUniqueLeagueList = (loc, callback) => {
    GameList.distinct('leaugue', { location: loc }  ,callback);
}