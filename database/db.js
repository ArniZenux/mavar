const sqlite3 = require('sqlite3').verbose(); 
var md5 = require('md5')
const Dbase = "./database/TulkurDATA.db"; 
//const Dbase = "./database/db.sqlite"; 

let db = new sqlite3.Database(Dbase, (err) => {
	if(err) {
		console.error(err.message); 
	}
	console.log('Connected to tulkur database');
});

module.exports = db; 