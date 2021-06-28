const express = require('express');
//var routes = require('./routes/route.js');
//var indexRouter = require('./routes/index');
//var userRouter = require('./routes/user');
//var projectRouter = require('./routes/project');
//var adduserRouter = require('./routes/adduser');
var bodyParser = require('body-parser')
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

    const { videos } = await lesa(); 
    
    if(!videos){
        return next();
    }
    res.render('projects', { title, subtitle, videos : videos });
}

async function addUsers(req, res){
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Bæta nýr táknamálstúlk';
    console.log('Request for home rec');
    res.render('addusers', { title, subtitle });
}
    
async function insertUser(req, res){
    const sql = "INSERT INTO tblTulkur (KT, NAFN, SIMI, NETFANG) VALEUS ( ?, ? , ? , ? )";
    const tulkur = [req.body.KT, req.body.NAFN, req.body.SIMI, req.body.NETFANG];
    try{
        db.run(sql, tulkur, err => {
            // if (err) ... 
            res.redirect('/');
        });
    }
    catch(e){
        console.error(e); 
    }
    
}

app.get('/', catchErrors(index));
app.get('/user', catchErrors(user)); 
app.get('/project', catchErrors(project));
app.get('/addusers', catchErrors(addUsers));

//app.post('/insertUser', catchErrors(insertUser));
app.post('/addusers', urlencodedParser,  (req, res) => {
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
});

function notFoundHandler(req, res, next) { // eslint-disable-line
    const title = 'Síða fannst ekki';
    res.status(404).render('error', { title });
    //res.send('Ekk finnst - 404');
}
        
function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    const title = 'Villa kom upp';
    //const subtitle = err.message;
    res.status(500).render('error', { title });
    //res.send('Error - 404');
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});