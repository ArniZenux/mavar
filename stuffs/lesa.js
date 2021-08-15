const db = require('./database');
var express = require("express")
var app = express()

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

app.get("/api", (req, res, next) => {
    console.log("ok api ");
});

app.get("/api/users", (req, res, next) => {
    var sql = "select * from tblTulkur"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          console.log(err.message); 
          return;
        }
        console.log("ok");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});