const db = require('./db.js');

async function skra(){
    var sql = 'INSERT INTO tblTulkur(KT, NAFN, SIMI, NETFANG) VALUES ( ? , ? , ? , ? )'; 
    var params = ['1411813359', 'Arni Ingi', '8240245', 'arnijoha@hi.is']; 
    db.run(sql,params, function(err) {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Tókst að skrá');
    });
}

skra(); 

db.close((err) => {
    if(err) {
        return console.error(err.message); 
    }
}); 