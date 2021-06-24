const db = require('./db_fix.js');

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

db.close((err) => {
    if(err) {
        return console.error(err.message); 
    }
}); 