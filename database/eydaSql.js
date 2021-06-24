const db = require('./db_fix.js');

async function eyda(){
    var sql = 'DELETE FROM tblTulkur WHERE KT =  ?'; 
    var params = ['0203863459']; 
    db.run(sql,params, function(err) {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Tókst að eyða');
    });
}

eyda(); 

db.close((err) => {
    if(err) {
        return console.error(err.message); 
    }
}); 
