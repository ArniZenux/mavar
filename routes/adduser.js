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

async function addusers(req, res){
    const title = 'Táknamálstúlkur';
    //const { tulkar } = await readList(); 
    //const readList();
    console.log('Request for home rec');
    res.render('addusers', { title });
}
    
router.get('/', catchErrors(addusers));

module.exports = router; 