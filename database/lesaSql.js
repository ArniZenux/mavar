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

async function lesa1(){
    var sql = 'Select * from tblTulkur'; 
    var params = []; 
    let result = []; 

    result =  db.all(sql, params, (err, row) => {
        if(err){ 
            return console.log(err.message ); 
        }
        //console.log(row); 
        result = row; 
    })
    var json = JSON.parse(result); 
    console.log(JSON.stringify(json));    
}

lesa1(); 

db.close((err) => {
    if(err) {
        return console.error(err.message); 
    }
}); 