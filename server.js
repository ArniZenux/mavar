const express = require('express');
var routes = require('./routes/route.js');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var projectRouter = require('./routes/project');
var adduserRouter = require('./routes/adduser');
const path = require("path");
const app = express(); 

const hostname = "127.0.0.1";
const port = 3000; 

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

//app.use('/', routes);
app.use('/', indexRouter); 
app.use('/user', userRouter); 
app.use('/project', projectRouter);
app.use('/adduser', adduserRouter);

/*app.get('/', (req, res) => {
    res.send('Hello');
});*/

function notFoundHandler(req, res, next) { // eslint-disable-line
    const title = 'Síða fannst ekki';
    res.status(404).render('error', { title });
    //res.send('Ekk finnst - 404');
}
  
function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    const title = 'Villa kom upp';
    const subtitle = err.message;
    res.status(500).render('error', { title, subtitle });
    //res.send('Error - 404');
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});