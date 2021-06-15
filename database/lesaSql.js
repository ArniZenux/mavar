const db = require('./db.js');

async function lesa(){
    var sql = 'Select * from tblTulkur'; 
    var params = []; 
    db.all(sql,params, (err, rows) => {
        if(err){
            console.log(err.message);
        }
        else{
            console.log(rows);
        }
    });
}

lesa(); 
