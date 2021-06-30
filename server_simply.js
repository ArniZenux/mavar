const express = require('express');
const bodyParser= require('body-parser')
const path = require("path");
const fs = require('fs').promises;
const app = express(); 
var db = require('./database/db.js');
const { json } = require('body-parser');
const { get } = require('http');
const { SSL_OP_NO_QUERY_MTU } = require('constants');

const hostname = "127.0.0.1";
const port = 3000; 

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
 
function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

/**************/
// Main Home  //
/**************/
async function index(req, res){
    console.log('Main home - index');
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = "SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR";
    try{
        db.all(sql, [], (err, rows) => {
            if(err) return console.error(err.message); 
            res.render('index', {title: title, subtitle: subtitle, model : rows});
        });
    }
    catch(e){
        console.error(e.message); 
    }
    //res.render('index', { title });
}

/**********/
// Birta  //
/**********/
async function user(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = "SELECT * FROM tblTulkur";
    try{
        db.all(sql, [], (err, rows) => {
            if(err) return console.error(err.message);
            res.render('users', {title: title , subtitle : subtitle, model : rows }); 
        });
    }
    catch(e){
        console.error(e);
    }
}

/**********/
// Birta  //
/**********/
async function project(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = "SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR";
    try{
        db.all(sql, [], (err, rows) => {
            if(err) return console.error(err.message); 
            res.render('projects', {title: title, subtitle: subtitle, model : rows});
        });
    }
    catch(e){
        console.error(e.message); 
    }
}

/**********/
// Birta  //
/**********/
async function addUsers(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýr táknamálstúlk';
    console.log('Request for home rec');
    res.render('addusers', { title, subtitle });
}
   
/**********/
// Birta  //
/**********/
async function addprojects(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýtt verkefni'; 
    console.log('new project - ');
    //Get Túlkur í listbox. 
    const sql = "SELECT * FROM tblTulkur";
   
    try{
        db.all(sql, [], (err, rows) => {
            if(err) return console.error(err.message);
            res.render('addprojects', {title: title , subtitle : subtitle, model : rows }); 
        });
    }
    catch(e){
        console.error(e);
    }
}

/************/
// Innsetja //
/************/
async function addusers(req, res){
    const sql = "INSERT INTO tblTulkur (KT, NAFN, SIMI, NETFANG) VALUES( ? , ? , ? , ? )";
    const tulkur = [req.body.KT, req.body.NAFN, req.body.SIMI, req.body.NETFANG];
    
    try{
        db.run(sql, tulkur, err => {
            if (err){
                console.error(err.message); 
            } 
            else{
                res.redirect('/');
                console.log('Tokst að skra');
            }
        });
    }
    catch(e){
        console.error(e); 
    }
}

/************/
// Innsetja //
/************/
async function addProjects(req, res){
    const sql_verkefni = "INSERT INTO tblVerkefni (HEITI, STADUR, DAGUR, TIMI_BYRJA, TIMI_ENDIR, VETTVANGUR) VALUES(?,?,?,?,?,?)";
    const sql_vinna = "INSERT INTO tblVinna(KT) VALUES( ? )";
    const verkefni = [req.body.HEITI, req.body.STADUR, req.body.DAGUR, req.body.TIMI_BYRJA, req.body.TIMI_ENDIR, req.body.VETTVANGUR];
    const nafn = [req.body.NAFN];
    const sql_select_kt = "SELECT KT FROM tblTulkur WHERE NAFN = ?";
    try{
        db.get(sql_select_kt, nafn, (err, rows)  => {
            if (err){
                console.error(err.message); 
            } 
            else{
                console.log('Tókst að ná kennitala túlka');
                const kt = rows.KT;  
                console.log(kt); 

                db.run(sql_vinna, kt, err => {
                    if(err) { 
                        console.error(err.message); 
                    }
                    else{
                        console.log('tblVinna skráð');
                    }
                });

                db.run(sql_verkefni, verkefni, err => {
                    if(err) { 
                        console.error(err.message); 
                    }
                    else{
                        console.log('tblVerkefni skráð');
                        res.redirect('/');
                    }
                });       
            }        
        }); 
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function user_select(req, res){
    const KT = req.params.KT;
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Uppfæra túlk'; 
    const sql = "SELECT * FROM tblTulkur WHERE KT = ?"; 
    try{
        db.get(sql, KT, (err, rows) => {
            if(err) return console.error(err.message); 
            console.log("KT: ", KT);
            res.render('userupdate', {subtitle : subtitle, title : title, model : rows })
        }) 
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function project_select(req, res){
    const NR = req.params.NR;
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Uppfæra verkefni'; 
    const sql = "SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR AND tblVerkefni.NR = ?"; 
    try{
        db.get(sql, NR, (err, rows) => {
            if(err) return console.error(err.message); 
            console.log("Númer verkefnis: ", NR);
            res.render('projectupdate', {subtitle : subtitle, title : title, model : rows })
        }) 
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function tulkur_select(req, res){
    const NR = req.params.NR;
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Skipta túlk'; 
    const sql_tulkaverkefni = "SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR AND tblVerkefni.NR = ?"; 
    const sql_tulkur = "SELECT * FROM tblTulkur"; 
    const rows_project = '';
    const rows_tulkur = '';
    try{
        db.get(sql_tulkaverkefni, NR, (err, rows_project) => {
            if(err) return console.error(err.message); 
            console.log("Númer verkefnis: ", NR);
            console.log(rows_project.HEITI + ' og ' + rows_project.NAFN); 
            rows_project = rows_project; 
            //res.render('tulkurupdate', {subtitle : subtitle, title : title, model : rows })
        });

        db.get(sql_tulkur,[], (err, rows) => {
            console.log(rows.KT + ' og nafn : ' + rows.NAFN);
            res.render('tulkurupdate', {subtitle : subtitle, title : title, rows_project : rows_project, rows_tulkur : rows_tulkur })
        }); 
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function userupdate(req, res){
    const KT = req.params.KT;
    const tulkur = [req.body.NAFN, req.body.SIMI, req.body.NETFANG, KT];
    const sql = "UPDATE tblTulkur SET NAFN = ?, SIMI = ? , NETFANG = ? WHERE (KT = ?)";
    try{
        db.run(sql, tulkur, err => {
            if (err){
                console.error(err.message); 
            } 
            else{
                res.redirect('/');
                console.log('Notandi uppfærður');
            }
        });
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function projectupdate(req, res){
    const NR = req.params.NR;
    const verkefni = [req.body.HEITI, req.body.STADUR, req.body.DAGUR, req.body.TIMI_BYRJA, req.body.TIMI_ENDIR, req.body.VETTVANGUR, NR];
    const sql = "UPDATE tblVerkefni SET HEITI = ?, STADUR = ?, DAGUR = ?, TIMI_BYRJA = ?, TIMI_ENDIR = ?, VETTVANGUR = ? WHERE (NR = ?)";
    try{
        db.run(sql, verkefni, err => {
            if (err){
                console.error(err.message); 
            } 
            else{
                res.redirect('/');
                console.log('Verkefni uppfærð');
            }
        });
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function tulkurupdate(req, res){
    const NR = req.params.NR;
    const nafn = [req.body.NAFN];
    const sql = "UPDATE tblVinna SET KT = ? WHERE (NR = ?)";
    try{
        /*db.run(sql, verkefni, err => {
            if (err){
                console.error(err.message); 
            } 
            else{
                res.redirect('/');
                console.log('Tulkur skipta');
            }
        });*/
        console.log("túlkur skipta tókst!");

    }
    catch(e){
        console.error(e); 
    }
}

/**********/
//  GET    /
/**********/
app.get('/', catchErrors(index));
app.get('/user', catchErrors(user)); 
app.get('/project', catchErrors(project));
app.get('/addusers', catchErrors(addUsers));
app.get('/addprojects', catchErrors(addprojects)); 
app.get('/user_select/:KT', catchErrors(user_select));
app.get('/project_select/:NR', catchErrors(project_select));
app.get('/tulkur_select/:NR', catchErrors(tulkur_select));

/**********/
//  POST   /
/**********/
app.post('/addusers', urlencodedParser, catchErrors(addusers));
app.post('/addprojects', urlencodedParser, catchErrors(addProjects));
app.post('/userupdate/:KT', urlencodedParser, catchErrors(userupdate));
app.post('/projectupdate/:NR', urlencodedParser, catchErrors(projectupdate));
app.post('/tulkurupdate/:NR', urlencodedParser, catchErrors(tulkurupdate));


/*****************/
//  Handler error /
/*****************/
function notFoundHandler(req, res, next) { // eslint-disable-line
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Síða fannst ekki';
    res.status(404).render('error', { title: title,subtitle : subtitle });
}
        
function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Villa kom upp';
    res.status(500).render('error', { title: title, subtitle : subtitle });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});