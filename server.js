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

var { list, insert, update } = require('./database/db_psql.js');

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
    //const model = 'Arni'; 

    const {
      heiti, dagur, stadur, timi_byrja, timi_endir, vettvangur
    } = req.body;
    
    const validation = validationResult(req);

    const rows = await list(sql); 

    if (!validation.isEmpty()) {
      return res.render('addprojects', { errors: validation.errors, title: title, subtitle: subtitle, model : rows });
    }
    
    return next();
}

/**************/
// Main Home  //
/**************/
async function index(req, res){
    console.log('Main home - index');
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';

    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr';

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
    const kt = [req.params.kt];
    console.log('kt ' + kt);
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr AND tblTulkur.kt = $1';

    const rows = await list(sql,kt); 

    res.render('tulkaproject', {title: title , subtitle : subtitle, model : rows }); 
}

/**********/
// Birta  //
/**********/
async function project(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr';
    
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
    else {
        res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} ); 
    }
}

/************/
// Innsetja //
/************/
async function addProjects(req, res){
    const sql_verkefni = "INSERT INTO tblVerkefni (heiti, stadur, dagur, timi_byrja, timi_endir, vettvangur) VALUES($1, $2, $3, $4, $5, $6)";
    const verkefni = [req.body.heiti, req.body.stadur, req.body.dagur, req.body.timi_byrja, req.body.timi_endir, req.body.vettvangur];
        
    const sql_select_kt = 'SELECT kt FROM tblTulkur WHERE nafn = $1';
    const nafn = [req.body.nafn];
    
    const sql_vinna = "INSERT INTO tblVinna(kt) VALUES($1)";
    
    let success = true; 
    let success1 = true; 

    try {
        const res = await list(sql_select_kt, nafn); 
        console.log(res); 
        const obj = JSON.stringify(res);
        const obj_s = obj.split(":");
        const kt_ = obj_s[1];
        const kt = kt_.slice(1,11);        
        success = await insert(sql_verkefni, verkefni);
        success1 = await insert(sql_vinna,[kt]);
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
}

/***********/
// Uppfæra //
/***********/
async function user_select(req, res){
    const kt = [req.params.kt];
    console.log('kt ' + kt);
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Uppfæra túlk'; 
    const sql = 'SELECT * FROM tblTulkur WHERE tblTulkur.kt = $1'; 

    try{
        const rows = await list(sql,kt); 
        res.render('userupdate', {errors: [], subtitle : subtitle, title : title, model : rows })
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function project_select(req, res){
    const nr = [req.params.nr];
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Uppfæra verkefni'; 
    const sql = "SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr AND tblVerkefni.nr = $1"; 
    
    try{
       const rows = await list(sql, nr); 
       res.render('projectupdate', {subtitle : subtitle, title : title, model : rows })
     }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function tulkur_select(req, res){
    const nr = [req.params.nr];
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Skipta túlk'; 
    const sql_tulkur = "SELECT * FROM tblTulkur, tblVinna WHERE tblTulkur.kt = tblVinna.kt AND tblVinna.nr = $1"; 
    const sql_all_tulkur = "SELECT * FROM tblTulkur"; 
   
    try{
        const one_tulkur = await list(sql_tulkur, nr);
        const all_tulkur = await list(sql_all_tulkur); 
        res.render('tulkurupdate', {subtitle : subtitle, title : title, one_tulkur : one_tulkur, all_tulkur : all_tulkur });
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function userupdate(req, res){
    const kt = [req.params.kt];
    console.log('kt ' + kt);
    const tulkur = [req.body.nafn, req.body.simi, req.body.netfang, kt];
    const sql = "UPDATE tblTulkur SET nafn = $1, simi = $2 , netfang = $3 WHERE tblTulkur.kt = $4";
    let success = true; 

    try{
        success = update(sql, kt); 
        
        if(success){
            res.redirect('/');
        }
        else {
            res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} ); 
        }
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function projectupdate(req, res){
    const nr = [req.params.nr];
    const verkefni = [req.body.heiti, req.body.stadur, req.body.dagur, req.body.timi_byrja, req.body.timi_endir, req.body.vettvangur, nr];
    const sql = "UPDATE tblVerkefni SET heiti = $1, stadur = $2, dagur = $3, timi_byrja = $4, timi_endir = $5, vettvangur = $6 WHERE nr = $7";
    let succress = true; 

    try{
        success = update(sql, kt); 
        
        if(success){
            res.redirect('/index');
        }
        else {
            res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} );
            console.log("fuck you");
        }
    }
    catch(e){
        console.error(e); 
    }
}

/***********/
// Uppfæra //
/***********/
async function tulkurupdate(req, res){
    const nr = [req.params.nr];
    const nafn = [req.body.nafn];
    const sql_select_kt = "SELECT kt FROM tblTulkur WHERE tblTulkur.nafn = $1?";
    let success = true; 

    try{
        /*success = update(sql, kt); 
        
        if(success){
            res.redirect('/');
        }
        else {
            res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} );
        }*/

        /*
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
        });*/
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
app.get('/user_select/:kt', catchErrors(user_select));
app.get('/user_pickup/:kt', catchErrors(user_pickup));
app.get('/project_select/:nr', catchErrors(project_select));
app.get('/tulkur_select/:nr', catchErrors(tulkur_select));

/**********/
//  POST   /
/**********/
app.post('/addusers', UserMiddleware, catchErrors(UserCheck), urlencodedParser, catchErrors(addusers));
app.post('/addprojects', ProjectMiddleware, catchErrors(ProjectCheck), urlencodedParser, catchErrors(addProjects));
app.post('/userupdate/:kt', urlencodedParser, catchErrors(userupdate));
app.post('/projectupdate/:nr', urlencodedParser, catchErrors(projectupdate));
app.post('/tulkurupdate/:nr', urlencodedParser, catchErrors(tulkurupdate));

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