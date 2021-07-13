const sqlite3 = require('sqlite3').verbose(); 
var md5 = require('md5')
const Dbase = "./TulkurDATA.db"; 

async function query(){
    const db = new sqlite3.Database(Dbase, (err) => {
        if(err) {
            console.error(err.message); 
            console.log("Not connection to database");
        }
        console.log('Connected to tulkur database');
    });

   return db; 
}


async function lesa(){
    let reuslt = []; 
    sql = "SELECT * FROM tblTulkur";
    try {
        const queryResult = await query(sql)
    }
}
query(); 
