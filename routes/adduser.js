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
/* async function lesa(){
   
}*/

async function User(req, res){
    const title = 'Bæta nýr táknamálstúlk';
    //const { tulkar } = await readList(); 
    //const readList();
    console.log('Request for home rec');
    res.render('addusers', { title });
}
    
async function adduser(req, res){
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

router.get('/', catchErrors(User));
router.post('/', catchErrors(adduser)); 
module.exports = router; 