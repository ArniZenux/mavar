const express = require('express');
const fs = require('fs');
const router = express.Router(); 

function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

async function readList(){
    try{
        const file = await fs.readFile('tulkar.json');
        const student = JSON.parse(file);
        //console.log(student);
        return student;
    }
    catch(e){
        throw new Error('Can´t read a JSON file!');
    }
}

async function lesaSkra(req,res){
        
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