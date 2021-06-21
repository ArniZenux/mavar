//const db = require('../database/db.js');
var dataModel = require('../models/data_model.js');
const express = require('express');
const fs = require('fs').promises;
const router = express.Router(); 

function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

/**
 * Les inn lista af list úr JSON skrá.
 * @returns {promise} Promise sem inniheldur gögn úr JSON skrá
 */
 async function lesaAnnad(){
    try{
        await fs.readFile('./routes/tulkar.json', (err, data) => {
            if (err) throw err; 
            const student = JSON.parse(data); 
            console.log(student); 
        })
    }
    catch(e){
        throw new Error('Can´t read a JSON file!');
    }
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

async function lesaSql(){
    dataModel.readTable("tblTulkur", function(data){
        console.log(data); 
    });
}
/*async function lesaSql(){
    //var registrations = await db.list(); 
    //console.log(registrations); 
    var sql = "select * from tblTulkur"
    var params = []; 
    console.log("hello");
    try {
        db.all(sql,params, (err, rows) => {
            if(err){
                console.log(err.message);
            }
            else{
                console.log(rows);
            }
        });
    }
    catch(e){
        throw new Error('Can´t read sql database');
    }
}*/

async function lesaSkra(){
    //const student = await lesaAnnad();
    //var student = await lesa();
    //console.log(student);    
    var student = "asdf"; 
    //lesa(); 
    const { videos } = await lesa(); 
    if (student === ""){
        console.log("Ekkert í string");
    } 
    else{
        console.log(videos);
    }
}

async function index(req, res){
    const title = 'Mávar';
    //const { tulkar } = await readList(); 
    //const readList();
    console.log('Request for home rec');
    res.render('index', { title });
}

async function user(req, res){
    const title = 'Táknmálstúlkar';

    const { videos } = await lesa(); 
    
    if(!videos){
        return next();
    }

    res.render('users', { title, videos : videos });
}

async function adduser(req, res){
    const title = 'Bæta nýr táknmálstúlk';
    
    res.render('addusers', { title });
}

async function project(req, res){
    const title = 'Verkefnalisti táknmálstúlka';
    
    const { videos } = await lesa(); 

    if(!videos){
        return next(); 
    }
    
    res.render('projects', { title, videos : videos });
}

router.get('/', catchErrors(index));

router.get('/user', catchErrors(user));

router.get('/project', catchErrors(project));

router.get('/adduser', catchErrors(adduser));

router.get('/lesaSkra', catchErrors(lesaSkra));

router.get('/lesaSql', catchErrors(lesaSql)); 

module.exports = router; 