var express = require('express');
var Router = require('./routes/route.js');
var path = require("path");
var app = express(); 

const hostname = "127.0.0.1";
const port = 3000; 

app.set('view engine', 'ejs');
app.use('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, "public")));

app.use(Router);

function notFoundHandler(req, res, next) { // eslint-disable-line
    const title = 'Myndband fannst ekki';
    const subtitle = 'Myndbandið sem þú ert að leita að finnst ekki 😨';
    //res.status(404).render('error', { title, subtitle });
    res.send('Ekk finnst - 404');
}
  
function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    const title = 'Villa kom upp';
    const subtitle = err.message;
    //res.status(500).render('error', { title, subtitle });
    res.send('Error - 404');
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});