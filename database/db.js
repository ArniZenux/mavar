const sqlite3 = require('sqlite3').verbose(); 
var md5 = require('md5')
//const Dbase = "./database/TulkurDATA.db"; 
const Dbase = "./database/TulkurSMALL.db"; 
//const Dbase = "TulkurDATA.db"; 

let db = new sqlite3.Database(Dbase, (err) => {
	if(err) {
		console.error(err.message); 
		console.log("Not connection to database");
	}
	console.log('Connected to tulkur database');
});

async function getTulkur(){
	let result = []; 

	const sql = "SELECT * FROM tblTulkur";
	try{
        const queryList = await db.all(sql, [], (err, rows) => {
                if(err) {
					return console.error(err.message);
				}
        });
		result = queryList; 

    }
    catch(e){
        console.error(e.message); 
    }
	
	return result; 

}

module.exports = { db, getTulkur }; 