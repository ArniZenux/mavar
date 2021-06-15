var db = require('../database/db.js');

function readTable (table, cb) {
    let sql = `SELECT * FROM ${table};`;
    let data = {}; 
    db.all(sql, (err, rows)  => {
        if(err) throw err; 
        rows.forEach(function(row){
            data[row] = {}; 
            Object.keys(row).forEach(function(k) {
                data[row][k] = unescape(row[k]);
            });
        });
        cb(data);  
    });
};

module.exports = { db,  readTable }