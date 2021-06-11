const sqlite3 = require('sqlite3').verbose(); 

//var md5 = require('md5')

const Dbase = "TulkurDATA.db"; 

let db = new sqlite3.Database(Dbase, (err) => {
	if(err) {
		console.error(err.message); 
	}
	console.log('Connected to tulkur database');
});

async function list(){
    let result = [];
    try{
        db.serialize(() => {
            db.each('Select * from tblTulkur', (err, row) => {
                if(err) {
                    console.error(err.message);
                }
                //console.log(row + "\t");
                result = [row.NAFN + "\t"];
            });
        });
    }
    catch(e){
        console.error("Can´t read database")
    }
    //return 'Hello another function from db.js'; 
}
result = [];

/*
db.serialize(() => {
	db.each('Select * from tblTulkur', (err, row) => {
		if(err) {
			console.error(err.message);
		}
        result = [row.NAFN ];
        //console.log(row.NAFN + "\t");
        console.log(result);
     
    });
});
*/

//db.close(); 

/*
db.close((err) => {
	if(err) {
		console.error(err.message);
	}
	console.log('Close connection');
});
*/
module.exports = {db, list}