/*Node & Server*/

var express = require('express');
var app = express();


/*Setting up handlebars*/

var exphandlebars = require('express-handlebars');

app.engine('handlebars', exphandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



/*Parser*/

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

/*CORS*/
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin','*')
	res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
	next();
});

/*Actually gets Heroku to work*/
app.set('port', (process.env.PORT || 3000));

var db = require('.models');

/*Ports*/

db.conn.once('open', function() {

    // Routes
    var router = require('./router');
    router(app, db, __dirname);

    app.listen(app.get('port'), function () {
        console.log('Server - listening on port '+app.get('port'));
        console.log('Server - IDLE - waiting for the first connection');
        console.log('================================================');
    });
});