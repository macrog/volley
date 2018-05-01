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
module.exports.getSets = (id, callback) => {
    GameList.find({"_id" : id}, {pointByPoint: 1}, callback);
}

//find({}) delete all objects
module.exports.findGamesWhere = (params, callback) => {
    if(params.home && params.away){
        var string =  params.home + ':' + params.away;
    }
    if(params.level && params.location && params.gender) {
        //level & location & gender & points
        GameList.find({ $and: [{'isSenior': params.level === 'S' ? true :  false}, {'location': params.location}, {'isMale': params.gender === 'M' ? true :  false}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else if(params.level && params.location) {
        //level & location & points
        GameList.find({ $and: [{'isSenior': params.level === 'S' ? true :  false}, {'location': params.location}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else if(params.level && params.gender) {
        //level & gender & points
        GameList.find({ $and: [{'isSenior': params.level === 'S' ? true :  false}, {'isMale': params.gender === 'M' ? true :  false}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else if(params.location && params.gender) {
        //location & gender & points
        GameList.find({ $and: [{'location': params.location}, {'isMale': params.gender === 'M' ? true :  false}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else if(params.location ) {
        // location & points
        GameList.find({ $and: [{'location': params.location}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else if(params.gender ) {
        // gender & points
        GameList.find({ $and: [{'isMale': params.gender === 'M' ? true :  false}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else if(params.level ) {
        // level & points
        GameList.find({ $and: [{'isSenior': params.level === 'S' ? true :  false}, {'pointByPoint': { '$all': [ string ] }}]}, callback);
    }else {
        // only points
        GameList.find( {'pointByPoint': { '$all': [ string ] } }, callback);
    }    
}
