const GameList = require('./schema');

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
