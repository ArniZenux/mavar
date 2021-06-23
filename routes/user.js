//const db = require('../database/db.js');
//var dataModel = require('../models/data_model.js');
var db = require('../database/db.js');
const express = require('express');
const fs = require('fs').promises;
const { resourceUsage } = require('process');
const router = express.Router(); 

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

/*async function users(req, res){
    const title = 'Táknmálstúlkar';

    const { videos } = await lesa(); 
    
    if(!videos){
        return next();
    }
    
    //res.render('users', { title });
    res.render('users', { title, videos : videos });
}*/

async function users(req, res){
    /*const test = {
        title : 'Táknmálstúlkur', 
        items : ['one', 'two', 'three']
    };*/
   
    const sql = "SELECT * FROM tblTulkur";
    try{
        db.all(sql, [], (err, rows) => {
            if(err) return console.error(err.message);
            res.render('users', {title : 'Táknamálstúlkur', model : rows }); 
        });
    }
    catch(e){
        console.error(e);
    }
    
    /*dataModel.readTable("tblTulkur", function(data) {
        res.render('users', {title: 'Táknmálstúlkur', model : data});            
    
    });*/
}



router.get('/', catchErrors(users));

module.exports = router; 