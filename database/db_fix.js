const sqlite3 = require('sqlite3').verbose(); 
var md5 = require('md5')
const Dbase = "TulkurDATA.db"; 

let db = new sqlite3.Database(Dbase, (err) => {
	if(err) {
		console.error(err.message); 
		console.log("Not connection to database");
	}
	console.log('Connected to tulkur database');
});

module.exports = db; 