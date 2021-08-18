//////////////////////
//                  //
//  Version : 0.2   //
//                  //
//////////////////////
const express = require('express');
const bodyParser= require('body-parser')
const path = require("path");
const fs = require('fs').promises;
const app = express(); 
const Joi = require('joi');

var { query, list, insert } = require('./database/db_psql.js');

const { json } = require('body-parser');
const { get } = require('http');
const { body, validationResult } = require('express-validator');
const { getgid } = require('process');
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

function isInvalid(field, errors = [] ){
    return Boolean(errors.find((i) => i && i.param === field ));
}

app.locals.isInvalid = isInvalid; 

const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

const UserMiddleware = [
    body('KT')
        .isLength( { min : 1 })
        .withMessage('Kennitala má ekki vera tómt'),
    body('KT')
        .matches(new RegExp(nationalIdPattern))
        .withMessage('Kennitala verður að vera á formi 000000-0000 eða 0000000000'),
     body('nafn')
        .isLength( {min : 1 })
        .withMessage('Nafn má ekki vera tómt'),
    body('nafn')
        .isLength( { max : 128 })
        .withMessage('Nafn má að hámarki vera 128 stafir'),
    body('simanumer')
        .isLength( { min : 1 })
        .withMessage( 'Símanúmer má ekki vera tómt'),
    body('simanumer')
        .matches(/\d/)
        .withMessage('Símanúmer verður innihaldi tölur'),
    body('simanumer')
        .isLength( { max : 8 })
        .withMessage( 'Símanúmer er hámark 8'), 
    body('email')
        .isEmail()
        .withMessage('Vantar tölvupóstur'),     
];

const ProjectMiddleware = [
    body('HEITI')
        .isLength( { min : 1 })
        .withMessage('Nafn verkefna má ekki vera tómt'),
    body('STADUR')
        .isLength( {min : 1} )
        .withMessage('Staður má ekki vera tómt'),
    body('DAGUR')
        .isLength( {min : 1 })
        .withMessage('Dagssetningur má ekki vera tómt'),
    body('TIMI_BYRJA')
        .isLength( { max : 5 })
        .withMessage('Timasetningur má að hámarki vera 5 stafir, ##:##'),
    body('TIMI_BYRJA')
        .isLength( { min : 1 })
        .withMessage('Timasetningur má ekki vera tómt, ##:##'),
    body('TIMI_ENDIR')
        .isLength( { max : 5 })
        .withMessage('Timasetningur má að hámarki vera 5 stafir, ##:##'),
    body('TIMI_ENDIR')
        .isLength( { min : 1 })
        .withMessage('Timasetningur má ekki vera tómt, ##:##'),
    body('VETTVANGUR')
        .isLength( { min : 1 })
        .withMessage('Vettvangur má ekki að vera tómt'),     
];


/***********/
//  CHECK  //
/***********/
async function UserCheck(req, res, next) {
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
   
    const {
      KT, nafn, simanumer, email,
    } = req.body;
    
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
        return res.render('addusers', { errors: validation.errors, title, subtitle });
    }
   
    return next();
}

/***********/
//  CHECK  //
/***********/
async function UpdateUserCheck(req, res, next){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const {
      KT, nafn, simanumer, email,
    } = req.body;
    
    const validation = validationResult(req);
  
    if (!validation.isEmpty()) {
      return res.render('userupdate', { errors: validation.errors, title, subtitle });
    }
   
    return next();
}

/**********/
//  CHECK  /
/**********/
async function ProjectCheck(req, res, next) {
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýtt verkefni';
    const sql = "SELECT * FROM tblTulkur";
    const model = 'Arni'; 

    const {
      heiti, dagur, stadur, timi_byrja, timi_endir, vettvangur
    } = req.body;
    
    const validation = validationResult(req);

    const rows = await list(sql); 

    if (!validation.isEmpty()) {
      return res.render('addprojects', { errors: validation.errors, title: title, subtitle: subtitle, model : rows });
    }
    /*
    try{
        await db.all(sql, [], (err, rows) => {
    
            if(err) {
                return console.error(err.message);
            }

            else if(!validation.isEmpty()) {
               return res.render('addprojects', { errors: validation.errors, title, subtitle, model : rows });
            }
            //res.render('addprojects', {errors, title: title , subtitle : subtitle, model : rows }); 
        });
    }
    catch(e){
        console.error(e);
    }
    */
    return next();
}

/**************/
// Main Home  //
/**************/
async function index(req, res){
    console.log('Main home - index');
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';

    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR';

    const rows = await list(sql); 

    res.render('index', {title: title, subtitle: subtitle, model : rows});
}

/**********/
// Birta  //
/**********/
async function user(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur'
    
    const rows = await list(sql); 
    
    res.render('users', {title: title , subtitle : subtitle, model : rows }); 
}

/**********/
// Birta  //
/**********/
async function userlisti(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur';
    
    const rows = await list(sql); 
    
    res.render('users_listi', {title: title , subtitle : subtitle, model : rows }); 
}

/**********/
// Birta  //
/**********/
async function user_pickup(req, res){
    const KT = req.params.KT;
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR AND tblTulkur.KT = ?';

    const rows = await list(sql); 

    res.render('tulkaproject', {title: title , subtitle : subtitle, model : rows }); 
}

/**********/
// Birta  //
/**********/
async function project(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR';
    
    const rows = await list(sql); 

    res.render('projects', {title: title, subtitle: subtitle, model : rows});
}

/**********/
// Birta  //
/**********/
async function addUsers(req, res){
    const errors = []; 
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýr táknamálstúlk';
    console.log('Request for home rec');
    res.render('addusers', {errors, title, subtitle });
}  
   
/**********/
// Birta  //
/**********/
async function addprojects(req, res){
    const errors = []; 
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýtt verkefni'; 
    const sql = 'SELECT * FROM tblTulkur';
   
    const rows = await list(sql);
    
    res.render('addprojects', {errors, title: title , subtitle : subtitle, model : rows }); 
}

/************/
// Innsetja //
/************/
async function addusers(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const sql = 'INSERT INTO tblTulkur (kt, nafn, simi, netfang) VALUES($1, $2, $3, $4)';
    const tulkur = [req.body.KT, req.body.nafn, req.body.simanumer, req.body.email];
    let success = true; 

    try {
        success = await insert(sql, tulkur)
    }
    catch(e){
        console.error(e);
    }

    if(success) {
        return res.redirect('/');
    }

    res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} ); 
}

/************/
// Innsetja //
/************/
async function addProjects(req, res){
    const sql_verkefni = "INSERT INTO tblVerkefni (heiti, stadur, dagur, timi_byrja, timi_endir, vettvangur) VALUES($1, $2, $3, $4, $5, $6)";
    const sql_vinna = "INSERT INTO tblVinna(nr, kt) VALUES(5, '1411813359')";
    const verkefni = [req.body.heiti, req.body.stadur, req.body.dagur, req.body.timi_byrja, req.body.timi_endir, req.body.vettvangur];
    const nafn = [req.body.nafn];
    const sql_select_kt = 'SELECT kt FROM tblTulkur WHERE nafn = $1';

    let success = true; 
    let success1 = true; 

    try {
            const res = await list(sql_select_kt, nafn); 
            console.log(res.parse());
            //success = await insert(sql_verkefni, verkefni);
            //success1 = await insert(sql_vinna);
    }
    catch(e){
        console.error(e);
    }

    if(success && success1){
        return res.redirect('/');
    }

    else{
        res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} ); 
    }

    /*
    try{
        await db.get(sql_select_kt, nafn, (err, rows)  => {
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
    }*/
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
        await db.get(sql, KT, (err, rows) => {
                if(err) return console.error(err.message); 
                console.log("KT: ", KT);
                res.render('userupdate', {errors: [], subtitle : subtitle, title : title, model : rows })
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
       await db.get(sql, NR, (err, rows) => {
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
    const sql_tulkur = "SELECT * FROM tblTulkur, tblVinna WHERE tblTulkur.KT = tblVinna.KT AND tblVinna.NR = ?"; 
    const sql_all_tulkur = "SELECT * FROM tblTulkur"; 
    var all_tulkur = '';
    var one_tulkur = '';
    try{
        await db.get(sql_tulkur, NR , (err, row) => {
            if(err){
                return console.error(err.message); 
            }
            else{
                console.log(row.KT + ' og nafn : ' + row.NAFN);
                one_tulkur = row; 
                db.all(sql_all_tulkur, [], (err, rows) => {
                    if(err){
                        return console.error(err.message);
                    }
                    else{
                        all_tulkur = rows; 
                        res.render('tulkurupdate', {subtitle : subtitle, title : title, one_tulkur : one_tulkur, all_tulkur : all_tulkur });
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
async function userupdate(req, res){
    const KT = req.params.KT;
    const tulkur = [req.body.nafn, req.body.simanumer, req.body.email, KT];
    const sql = "UPDATE tblTulkur SET NAFN = ?, SIMI = ? , NETFANG = ? WHERE (KT = ?)";
    try{
        await db.run(sql, tulkur, err => {
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
        await db.run(sql, verkefni, err => {
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
    const sql_select_kt = "SELECT KT FROM tblTulkur WHERE tblTulkur.NAFN = ?";
    try{
        await db.get(sql_select_kt, nafn, (err, rows)  => {
            if (err){
                console.error(err.message); 
            } 
            else{
                console.log('Tókst að ná kennitala túlka');
                const kt = rows.KT;  
                const sql_tblvinna = "UPDATE tblVinna SET KT = " + kt + " WHERE (NR = ?)";

                db.run(sql_tblvinna, NR, err => {
                    if(err) { 
                        console.error(err.message); 
                    }
                    else{
                        console.log("túlkur skipta tókst!");
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

/**********/
//  GET    /
/**********/
app.get('/', catchErrors(index));
app.get('/user', catchErrors(user));
app.get('/userlisti', catchErrors(userlisti)); 
app.get('/project', catchErrors(project));
app.get('/addusers', catchErrors(addUsers));
app.get('/addprojects', catchErrors(addprojects)); 
app.get('/user_select/:KT', catchErrors(user_select));
app.get('/user_pickup/:KT', catchErrors(user_pickup));
app.get('/project_select/:NR', catchErrors(project_select));
app.get('/tulkur_select/:NR', catchErrors(tulkur_select));

/**********/
//  POST   /
/**********/

app.post('/addusers', UserMiddleware, catchErrors(UserCheck), urlencodedParser, catchErrors(addusers));
app.post('/addusers', urlencodedParser, catchErrors(addusers));
//app.post('/addprojects', ProjectMiddleware, catchErrors(ProjectCheck), urlencodedParser, catchErrors(addProjects));
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