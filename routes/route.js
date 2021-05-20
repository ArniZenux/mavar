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

module.exports = router; 