var { list, insert, update } = require('./../database/db_psql');

async function user(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur'
    
    const rows = await list(sql); 
    
    res.render('users', {title: title , subtitle : subtitle, model : rows }); 
}

async function userlisti(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur';
    
    const rows = await list(sql); 
    
    res.render('users_listi', {title: title , subtitle : subtitle, model : rows }); 
}


async function addUsers(req, res){
    const errors = []; 
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýr táknamálstúlk';
    
    res.render('addusers', {errors, title, subtitle });
}  

async function user_select(req, res){
    const kt = [req.params.kt];

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

async function user_pickup(req, res){
    const kt = [req.params.kt];
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Táknmálstúlkur';
    const sql = 'SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.kt=tblVinna.kt AND tblVinna.nr=tblVerkefni.nr AND tblTulkur.kt = $1';

    const rows = await list(sql,kt); 

    res.render('tulkaproject', {title: title , subtitle : subtitle, model : rows }); 
}

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

async function update_user(req, res){
    const title = 'Mávar - túlkuþjónusta';

    const tulkur = [req.body.nafn, req.body.simi, req.body.netfang, req.params.kt];
    const sql = 'UPDATE tblTulkur SET nafn = $1, simi = $2, netfang = $3 WHERE tblTulkur.kt = $4';

    let success = true; 

    try{
        success = update(sql, tulkur);

        if(success) {
            return res.redirect('/');
        }
        else {
            res.render('error', {title, suberror: 'Gat ekki skráð', subtitle : 'Hafði þú skrifað undir áður?'} ); 
        }
    }
    catch(e){
        console.error(e);
    }
}

async function add_newuser(req, res){
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


async function change_tulkur(req, res){
    const title = 'Mávar - túlkuþjónusta';

    const sql = 'UPDATE tblVinna SET kt = $1 WHERE nr = $2';
    const sql_select_kt = 'SELECT kt FROM tblTulkur WHERE nafn = $1';
    const nafn = [req.body.nafn];
    console.log(nafn);
    const kennt = await list(sql_select_kt, nafn); 
    const obj = JSON.stringify(kennt);
    const obj_s = obj.split(":");
    const kt_ = obj_s[1];
    const kt = kt_.slice(1,11);        
    const change = [kt, req.params.nr];

    let success = true; 
    console.log(change);
    
    try{
        success = update(sql, change); 
        
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

module.exports = {
    user, 
    addUsers, 
    user_select, 
    user_pickup, 
    userlisti, 
    tulkur_select, 
    update_user, 
    add_newuser,
    change_tulkur
}; 