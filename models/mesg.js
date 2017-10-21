var mongoose = require ('mongoose');

//Mesg Schema

var mesgSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    status: {
       type: String,
    },
    sentiment: {
        type: String,
    },
    tasks_completed: {
        type: Number,
    },
    start_time: {
        type: Date,
        default: Date.now
    },
    end_time:{
        type: Date
    },
    processing_time: {
        type: Number
    },
    word_frequency: {
        type: Array
    },
    vowel_frequency: {
        type: Array
    }
});

var Mesg = module.exports = mongoose.model('Mesg', mesgSchema);

//Get Book
module.exports.getMesgById = function(id, callback) {
    Mesg.findById(id, callback);
}

// Add book
module.exports.addMesg = function(msg, callback) {
//    console.log ("Got msg:"+text);
    var text = msg.text;
    var starttime = Date.now();
    var mesg = {};
    mesg.text = text;
    var text = process_text(text);
    mesg.status = 'Processing In Progress';
    mesg.tasks_completed = 1;
    mesg.vowel_frequency = getVowelFrequency(text);
    mesg.tasks_completed = 2;
    mesg.word_frequency = getWordFrequency(text);
    mesg.tasks_completed = 3;
    mesg.sentiment = analyzeSentiment(mesg.word_frequency);
    mesg.tasks_completed = 4;
    mesg.end_time= Date();
    var endtime = Date.now();
    mesg.processing_time = endtime-starttime;
    mesg.status= 'Processing Completed';
    //console.log(mesg);
    Mesg.create(mesg, callback);
}

function process_text(text) {
    var word_frequency = {};
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    text = text.trim();
    text = text.replace(/\s{2,}/g," ");
    return text;
}

function getWordFrequency (text) {
    var word_frequency= {};
    var words = text.split(" ");
    words.forEach(function(entry) {
        if( word_frequency[entry.toLowerCase()] === undefined) {
            word_frequency[entry.toLowerCase()] = 1;
        }
        else {
            word_frequency[entry.toLowerCase()] += 1;
        }
    });
    //word_frequency = JSON.parse(word_frequency);
    return word_frequency;
}

function getVowelFrequency (text) {
    var vowel_frequency= {};
    var letters = text.split("");
    letters.forEach(function(entry) {
        entry = entry.toLowerCase();
        if(entry === 'a' || entry === 'e' ||entry === 'i' || entry === 'o' || entry === 'u') {
            if( vowel_frequency[entry] === undefined) {
                vowel_frequency[entry] = 1;
            }
            else {
                vowel_frequency[entry] += 1;
            }
        }
    });
    //vowel_frequency = JSON.parse(vowel_frequency);
    return vowel_frequency;
}

function analyzeSentiment(word_frequency) {
    var count=0;
    for (var key in word_frequency) {
        if (word_frequency.hasOwnProperty(key)) {
            count += getSentiment(key)* word_frequency[key];
        }
    }
    //console.log("count="+count);
    if(count > 2) {
        return 'postive';
    }
    else if(count < -2){
        return 'negative';
    }
    else {
        return 'neutral';
    }
}

function getSentiment (word) {
    var positive_words = ['nice','enjoyable','happy','like','amazing','good','love','agree','wonderful','awesome','great',' incredible'];
    var negative_words = ['cry', 'hate', 'kill', 'die', 'disgusting', 'awful', 'terrible', 'horrible'];
    if (isInArray(word, positive_words)) {
        return 1;
    }
    else if(isInArray(word, negative_words)) {
        return -1;
    }
    return 0;
}

function isInArray(s,your_array) {
    for (var i = 0; i < your_array.length; i++) {
        if (your_array[i].toLowerCase() === s.toLowerCase()) {
            return true;
        }
    }
    return false;
}
