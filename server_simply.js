const express = require('express');
//var routes = require('./routes/route.js');
//var indexRouter = require('./routes/index');
//var userRouter = require('./routes/user');
//var projectRouter = require('./routes/project');
//var adduserRouter = require('./routes/adduser');
const bodyParser= require('body-parser')
const path = require("path");
const fs = require('fs').promises;
const app = express(); 
var db = require('./database/db.js');

const hostname = "127.0.0.1";
const port = 3000; 

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
 
//app.use(express.static(path.join(__dirname, "style")));
/*app.use('/', indexRouter); 
app.use('/user', userRouter); 
app.use('/project', projectRouter);
app.use('/adduser', adduserRouter);

app.get('/', (req, res) => {
    res.send('Hello');
});
*/

function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

/**
 * Les inn lista af list úr JSON skrá.
 * @returns {promise} Promise sem inniheldur gögn úr JSON skrá
 */
 async function lesa(){
    let openFile_ = null; 
    try {
        //openFile_ = await fs.open('./routes/tulkar.json', 'r');   
        openFile_ = await fs.open('./routes/videos.json', 'r');   
        var readFile_ = await fs.readFile(openFile_);  
        var student = JSON.parse(readFile_); 
        //console.log(student); 
        return student; 
    }    
    catch(e){
        throw new Error('Can´t read a JSON file!');
    }
    finally{
        if(openFile_){
            await openFile_.close(); 
        }
    }
}

async function index(req, res){
    const title = 'Mávar - túlkuþjónusta';
    console.log('Main home - index');
    res.render('index', { title });
}

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

async function project(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Verkefnalisti táknmálstúlka';
    const sql = "SELECT * FROM tblVerkefni";
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

async function addUsers(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýr táknamálstúlk';
    console.log('Request for home rec');
    res.render('addusers', { title, subtitle });
}
    
async function addprojects(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýtt verkefni'; 
    console.log('new project - ');
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
    //res.render('addprojects', { title : title, subtitle : subtitle });
}

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

async function addProjects(req, res){
    const sql = "INSERT INTO tblVerkefni (HEITI, STADUR, DAGUR, TIMI_BYRJA, TIMI_ENDIR, VETTVANGUR) VALUES(?,?,?,?,?,?)";
    const verkefni = [req.body.HEITI, req.body.STADUR, req.body.DAGUR, req.body.TIMI_BYRJA, req.body.TIMI_ENDIR, req.body.VETTVANGUR];
    
    try{
        db.run(sql, verkefni, err => {
            if (err){
                console.error(err.message); 
            } 
            else{
                res.redirect('/');
                console.log('Nýtt verkefni skráð');
            }
        });
    }
    catch(e){
        console.error(e); 
    }
}

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

async function project_select(req, res){
    const NR = req.params.NR;
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Uppfæra verkefni'; 
    const sql = "SELECT * FROM tblVerkefni WHERE NR = ?"; 
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


/**********/
//  POST   /
/**********/
app.post('/addusers', urlencodedParser, catchErrors(addusers));
app.post('/addprojects', urlencodedParser, catchErrors(addProjects));
app.post('/userupdate/:KT', urlencodedParser, catchErrors(userupdate));
app.post('/projectupdate/:NR', urlencodedParser, catchErrors(projectupdate));

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