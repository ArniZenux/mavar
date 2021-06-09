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
     
    console.log('notendur');
    res.render('users', { title });
}

async function project(req, res){
    const title = 'Verkefnalisti táknmálstúlka';
    console.log('notendur');
    res.render('projects', { title });
}

router.get('/', catchErrors(index));

router.get('/user', catchErrors(user));

router.get('/project', catchErrors(project));

router.get('/lesaSkra', catchErrors(lesaSkra)); 

module.exports = router; 