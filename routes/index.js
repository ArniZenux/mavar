var { list } = require('./../database/db_psql');

async function index(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';

    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr';

    const rows = await list(sql); 

    res.render('index', {title: title, subtitle: subtitle, model : rows});
}

module.exports = index;     