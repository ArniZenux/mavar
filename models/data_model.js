var db = require('../database/db.js');

function readTable (table, cb) {
    let sql = `SELECT * FROM ${table};`;
    let data = {}; 
    db.all(sql, [], (err, rows) => {
        if(err) return console.error(err.message);
        rows.forEach(function(row){
            data[row] = {}; 
            Object.keys(row).forEach(function(k) {
                data[row][k] = unescape(row[k]);
            });
        });
        cb(data);  
        //return rows; 
    });
};

module.exports = { db,  readTable }