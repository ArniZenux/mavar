
const express = require('express');
const bodyParser= require('body-parser')
const path = require("path");
const fs = require('fs').promises;
const app = express(); 
const Joi = require('joi');

var index = require('./routes/index.js');
var { user, addUsers, user_select, user_pickup, userlisti, tulkur_select, update_user, add_newuser, change_tulkur } = require('./routes/users.js');
var { project, addprojects, project_select, project_update, addProjects } = require('./routes/project.js');
var { ProjectCheck, UserCheck } = require('./routes/check.js');

const { json } = require('body-parser');
const { get } = require('http');
const { body, validationResult } = require('express-validator');
const { getgid } = require('process');

const hostname = "127.0.0.1";
const port = 3000; 

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
 
function catchErrors(fn){
    return (req, res, next) => fn(req, res, next).catch(next); 
}

function isInvalid(field, errors = [] ){
    return Boolean(errors.find((i) => i && i.param === field ));
}

app.locals.isInvalid = isInvalid; 

const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

const UserMiddleware = [
    body('KT')
        .isLength( { min : 1 })
        .withMessage('Kennitala má ekki vera tómt'),
    body('KT')
        .matches(new RegExp(nationalIdPattern))
        .withMessage('Kennitala verður að vera á formi 000000-0000 eða 0000000000'),
     body('nafn')
        .isLength( {min : 1 })
        .withMessage('Nafn má ekki vera tómt'),
    body('nafn')
        .isLength( { max : 128 })
        .withMessage('Nafn má að hámarki vera 128 stafir'),
    body('simanumer')
        .isLength( { min : 1 })
        .withMessage( 'Símanúmer má ekki vera tómt'),
    body('simanumer')
        .matches(/\d/)
        .withMessage('Símanúmer verður innihaldi tölur'),
    body('simanumer')
        .isLength( { max : 8 })
        .withMessage( 'Símanúmer er hámark 8'), 
    body('email')
        .isEmail()
        .withMessage('Vantar tölvupóstur'),     
];

const ProjectMiddleware = [
    body('HEITI')
        .isLength( { min : 1 })
        .withMessage('Nafn verkefna má ekki vera tómt'),
    body('STADUR')
        .isLength( {min : 1} )
        .withMessage('Staður má ekki vera tómt'),
    body('DAGUR')
        .isLength( {min : 1 })
        .withMessage('Dagssetningur má ekki vera tómt'),
    body('TIMI_BYRJA')
        .isLength( { max : 5 })
        .withMessage('Timasetningur má að hámarki vera 5 stafir, ##:##'),
    body('TIMI_BYRJA')
        .isLength( { min : 1 })
        .withMessage('Timasetningur má ekki vera tómt, ##:##'),
    body('TIMI_ENDIR')
        .isLength( { max : 5 })
        .withMessage('Timasetningur má að hámarki vera 5 stafir, ##:##'),
    body('TIMI_ENDIR')
        .isLength( { min : 1 })
        .withMessage('Timasetningur má ekki vera tómt, ##:##'),
    body('VETTVANGUR')
        .isLength( { min : 1 })
        .withMessage('Vettvangur má ekki að vera tómt'),     
];


/**********/
//  GET    /
/**********/
app.get('/', catchErrors(index));
app.get('/user', catchErrors(user));
app.get('/userlisti', catchErrors(userlisti)); 
app.get('/project', catchErrors(project));
app.get('/addUsers', catchErrors(addUsers));
app.get('/addprojects', catchErrors(addprojects)); 
app.get('/user_select/:kt', catchErrors(user_select));
app.get('/user_pickup/:kt', catchErrors(user_pickup));
app.get('/project_select/:nr', catchErrors(project_select));
app.get('/tulkur_select/:nr', catchErrors(tulkur_select));

/**********/
//  POST   /
/**********/
app.post('/update_user/:kt', urlencodedParser, catchErrors(update_user));
app.post('/project_update/:nr', urlencodedParser, catchErrors(project_update));
app.post('/add_newuser', UserMiddleware, catchErrors(UserCheck), urlencodedParser, catchErrors(add_newuser));
app.post('/addprojects', ProjectMiddleware, catchErrors(ProjectCheck), urlencodedParser, catchErrors(addProjects));
app.post('/change_tulkur/:nr', urlencodedParser, catchErrors(change_tulkur));

/*****************/
//  Handler error /
/*****************/
function notFoundHandler(req, res, next) { // eslint-disable-line
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Síða fannst ekki';
    res.status(404).render('error', { title: title,subtitle : subtitle });
}
        
function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    const title = 'Mávar - túlkuþjónusta';
    const subtitle = 'Villa kom upp';
    res.status(500).render('error', { title: title, subtitle : subtitle });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});