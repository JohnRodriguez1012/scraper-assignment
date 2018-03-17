const env = process.env.NODE_ENV || 'development';
const config = require('../mongo-config.json')[env];
const mongoose = require('mongoose');
var Promise = require('bluebird');


mongoose.Promise= Promise;

//DB w/ models
var db = {};

db.IssueModel   = require('./issue.js');
db.ItemModel    = require('./item.js');
db.CommentModel = require('./comment.js');
db.mongoose = mongoose;

//Connect that mongoose
db.conn = mongoose.connection;

mongoose.connect(config.MONGODB_URI,(err, data) =>{
	if(err)
	    console.log(err);
	else{
	    console.log("connection success");
	    db.connflag = true;
	}  
});

// Show any errors
db.conn.on("error", (error)=> {
    console.log("Mongoose Error: ", error);
    throw error;
});


module.exports = db;