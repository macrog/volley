const gameSchema = require('../models/schema');

module.exports = {
    mapGame: function(object) {
        var game = new gameSchema({
            location: object.location,
            leaugue: object.leaugue,
            isMale: object.isMale,
            isSenior: object.isSenior,
            team1Name:  object.team1Name,
            team2Name:  object.team2Name,
            team1Set:  object.team1Set,
            team2Set:  object.team2Set,
            team1Points:  object.team1Points,
            team2Points:  object.team2Points,
            team1Aces:  object.team1Aces,
            team2Aces:  object.team2Aces,
            team1Kills:  object.team1Kills,
            team2Kills:  object.team2Kills,
            team1Blocks:  object.team1Blocks,
            team2Blocks:  object.team2Blocks,
            team1ServiceErrors:  object.team1ServiceErrors,
            team2ServiceErrors:  object.team2ServiceErrors,
            sets:  object.sets,
            setsFinal: object.setsFinal,
            setsAll: object.setsAll
        });

        return game;
    },
    getSetsPoitns: function(array) {
        var indexsOfEndSet = [];
        var sets = [];
        var setsToReturn = [];
        var points = array;
        array.forEach((element, index) => {            
            if(element === "1:0" || element === "0:1"){
                indexsOfEndSet.push(index);                
            }            
        });    
        indexsOfEndSet.forEach((value, index) => {           
            var set = [];
            var first = value;
            var last;
            if(index !== indexsOfEndSet.length - 1){
                last = indexsOfEndSet[index + 1];
            }else{
                last = points.length;
            }
            if(!last) last = points.length;
            
            for(var i = first; i < last; i++){
                set.push(points[i]);
            }
            
            sets.push(set);
        });

        sets.forEach((set, index) => {
            var obj = {};
            obj[index] = set;
            setsToReturn.push(obj);
        });
        
        return setsToReturn;
    },
    getSetsFinalPoints: function(multiArray) {
        var setsFinal = [];
        if(multiArray.length > 0) {
            for(var i = 0; i < multiArray.length; i++){
                setsFinal.push(multiArray[i][i][multiArray[i][i].length - 1]);
            }
        }
        return setsFinal;
    },
    getStats: function(lists, points, set) {        
        var arrayKeys = [];
        var stats = [];
        
        lists.forEach(game => {
            if(points === null && set === null) {
                game.setsFinal.forEach(setFinalScore => {  
                    var obj = {
                        result: '',
                        count: 0,
                        dif: 0,
                        sum: 0
                    }              
                    if(arrayKeys.indexOf(setFinalScore) === -1) {
                        var score = setFinalScore.split(':')
                        arrayKeys.push(setFinalScore);
                        obj.result = setFinalScore;
                        obj.count++;
                        obj.dif = parseInt(score[0]) - parseInt(score[1]);
                        obj.sum = parseInt(score[0]) + parseInt(score[1]);
    
                        stats.push(obj);
                    }else {
                        var index = stats.findIndex(x => x.result === setFinalScore);
                        stats[index].count++;
                    }                
                });
            } else if(points && set) {
                var setFinalScore = game.setsFinal[set];
                if(arrayKeys.indexOf(game.setsFinal[set]) === -1) {
                    var obj = {
                        result: '',
                        count: 0,
                        dif: 0,
                        sum: 0
                    } 
                    var score = setFinalScore.split(':')
                    arrayKeys.push(setFinalScore);
                    obj.result = setFinalScore;
                    obj.count++;
                    obj.dif = parseInt(score[0]) - parseInt(score[1]);
                    obj.sum = parseInt(score[0]) + parseInt(score[1]);

                    stats.push(obj);
                }else {
                    var index = stats.findIndex(x => x.result === setFinalScore);
                    stats[index].count++;
                }
            } else if(points) {
                game.sets.forEach( (set, i) => {
                    if(set[i].indexOf(points) !== -1) {
                        var setFinalScore = set[i][set[i].length-1];
                        if(arrayKeys.indexOf(setFinalScore) === -1) {
                            var obj = {
                                result: '',
                                count: 0,
                                dif: 0,
                                sum: 0
                            }          
                            
                            var score = setFinalScore.split(':')
                            arrayKeys.push(setFinalScore);
                            obj.result = setFinalScore;
                            obj.count++;
                            obj.dif = parseInt(score[0]) - parseInt(score[1]);
                            obj.sum = parseInt(score[0]) + parseInt(score[1]);
        
                            stats.push(obj);
                        }else {
                            var index = stats.findIndex(x => x.result === setFinalScore);
                            stats[index].count++;
                        }
                    }
                });
            }
        });
        

        return stats;
    },
    multiply: function(a,b) {
        return a*b
    }
};