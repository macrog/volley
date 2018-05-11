const gameSchema = require('../models/schema');

module.exports = {
    creteQueryObject: function(params) {
        var query = { $and:[]};
        if(params.level){
            query.$and.push({'isSenior': params.level === 'S' ? true :  false});
        }
        if(params.gender ) {
            query.$and.push({'isMale': params.gender === 'M' ? true :  false});
        }
        if(params.location) {
            query.$and.push({'location': params.location});
        }
        if(params.home !== null && params.away !== null) {
            var searchResult =  params.home + ':' + params.away;
            
            query.$and.push({'setsAll' : { $elemMatch: {$in: [searchResult] }}});
            //{"Keys.1" : {$elemMatch : {$in:['pol'] } } }
            // db.multiArr.find({'Keys':{$elemMatch:{$elemMatch:{$in:['carrot']}}}})
            
        }

        if(query.$and.length === 0) {
            query = {};
        }

        return query;
    }
};