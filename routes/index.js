//const db = require('../database/db.js');
var dataModel = require('../models/data_model.js');
const express = require('express');
const router = express.Router(); 

function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

async function index(req, res){
    const title = 'Mávar';
    //const { tulkar } = await readList(); 
    //const readList();
    console.log('Request for home rec');
    res.render('index', { title });
}

router.get('/', catchErrors(index));

module.exports = router; 