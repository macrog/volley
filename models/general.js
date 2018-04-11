const GameList = require('./schema');

//distinct() returns unique values of a field in DB
module.exports.getUniqueCountriesList = (callback) => {
    GameList.distinct('location' ,callback);
}