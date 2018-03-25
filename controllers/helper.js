const gamelist = require('../models/game');

module.exports = {
    mapGame: function(object) {
        var game = new gamelist({
            location: object.location,
            leaugue: object.leaugue,
            men: object.men,
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
            pointByPoint:  object.pointByPoint,
            setsFinal: object.setsFinal
        });

        return game;
    },
    getSetsPoitns: function(array, finalPointOlny) {
        var indexsOfEndSet = [];
        var sets = [];
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

            if(!finalPointOlny){
                for(var i = first; i < last; i++){
                    set.push(points[i]);
                }
            }else {
                set.push(points[last -1]);
            }

            sets.push(set);
        });
        
        return sets;
    },
    multiply: function(a,b) {
        return a*b
    }
};