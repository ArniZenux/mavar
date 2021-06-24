const db = require('./db.js');

async function skra(){
    var sql = 'UPDATE tblTulkur SET SIMI = ? WHERE KT = ?'; 
    var params = ['5552694', '1411813359']; 
    db.run(sql,params, function(err) {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Tókst að uppfæra');
    });
}


skra(); 

db.close((err) => {
    if(err) {
        return console.error(err.message); 
    }
}); 
