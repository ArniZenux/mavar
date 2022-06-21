var { list, insert, update, del } = require('./../database/db_psql');

async function project(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr';
    
    const rows = await list(sql); 

    res.render('projectAdd', {title: title, subtitle: subtitle, model : rows});
}

async function projectChange(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr';
    
    const rows = await list(sql); 

    res.render('projects', {title: title, subtitle: subtitle, model : rows});
}

async function projectDelete(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr';
    
    const rows = await list(sql); 

    res.render('projectDelete', {title: title, subtitle: subtitle, model : rows});
}

async function project_add(req, res){
    const errors = []; 
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýtt verkefni'; 
    const sql = 'SELECT * FROM tblTulkur';
   
    const rows = await list(sql);
    
    res.render('addprojects', {errors, title: title , subtitle : subtitle, model : rows }); 
}

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

async function project_update(req, res){
    const title = 'Mávar - túlkuþjónusta';

    const verkefni = [req.body.heiti, req.body.stadur, req.body.dagur, req.body.timi_byrja, req.body.timi_endir, req.body.vettvangur, req.params.nr];
    const sql = "UPDATE tblVerkefni SET heiti = $1, stadur = $2, dagur = $3, timi_byrja = $4, timi_endir = $5, vettvangur = $6 WHERE tblVerkefni.nr = $7";
    let succress = true; 

    try{
        success = update(sql, verkefni); 
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

async function project_insert(req, res){
    const sql_verkefni = "INSERT INTO tblVerkefni (heiti, stadur, dagur, timi_byrja, timi_endir, vettvangur) VALUES($1, $2, $3, $4, $5, $6)";
    const verkefni = [req.body.heiti, req.body.stadur, req.body.dagur, req.body.timi_byrja, req.body.timi_endir, req.body.vettvangur];
        
    const sql_select_kt = 'SELECT kt FROM tblTulkur WHERE nafn = $1';
    const nafn = [req.body.nafn];
    
    const sql_vinna = "INSERT INTO tblVinna(kt) VALUES($1)";
    
    let success = true; 
    let success1 = true; 

    try {
        const res = await list(sql_select_kt, nafn); 
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

async function project_delete(req,res){
    const nr = [req.params.nr];
    
    const sql_dVerkefni = "DELETE FROM tblVerkefni WHERE tblVerkefni.nr = $1";
    const sql_dVinna = "DELETE FROM tblVinna WHERE tblVinna.nr = $1";
    
    let success_verkefni = true; 
    let success_vinna = true; 

    console.log("Verkefni eyda");

    try {
        success_verkefni = del(sql_dVerkefni, nr);
        success_vinna = del(sql_dVinna, nr); 

        if(success_verkefni && success_vinna ){
            res.redirect('/');
        }
        else {
            res.render('error', {title, suberror: 'Gat ekki eyðið', subtitle : ''} );
        }
    }
    catch(e){
        console.error(e); 
    }
}

module.exports = { 
    project, 
    projectChange,
    projectDelete,
    project_add, 
    project_select, 
    project_update,
    project_delete, 
    project_insert }; 