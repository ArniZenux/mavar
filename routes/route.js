const express = require('express');
const fs = require('fs');
const router = express.Router(); 

function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

async function readList(){
    try{
        const file = await fs.readFile('tulkar.json');
        console.log(file)
        //return JSON.parse(file);
    }
    catch(e){
        throw new Error('Fuck you!');
    }
}

async function index(req, res){
    const title = 'Mávar';
    //const { tulkar } = await readList(); 

    console.log('Request for home rec');
    res.render('index', { title });
}

router.get('/', catchErrors(index));

module.exports = router; 