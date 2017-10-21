var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
Mesg = require('./models/mesg')

app.use(bodyParser.json());

//Connect to mongoose
mongoose.connect("mongodb://localhost/messages");

var db = mongoose.connection;

app.get('/',function(req, res) {
    res.send('Hello World');
});

// app.post('/',function(req,res) {
//     var body = req
// })

app.get('/api',function(req,res) {
    var id = req.query.id;
    console.log("I have reached here!!:"+id);
    Mesg.getMesgById(id, function (err, mesg) {
        if (err) {
            throw err;
        }
        res.json(mesg);
    });
})

app.post('/api',function(req,res) {
    //console.log("I have reached here in create!!:");
    var msg = req.body;
    //console.log("message sent:"+msg);
    Mesg.addMesg(msg, function (err, mesg) {
        if (err) {
            throw err;
        }
        res.send(mesg._id);
    });
})

app.listen(3000);
console.log('Running on port 3000');
