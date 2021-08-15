const fs = require('fs');

function lesa(){
    try{
        fs.readFile('./routes/tulkar.json', (err, data) => {
            if (err) throw err; 
            const student = JSON.parse(data); 
            console.log(student); 
        });
    }
    catch(e){
        throw new Error('Can´t read a JSON file!');
    }
}

function lesa1(){
    let list = fs.readFile('./routes/tulkar.json');
}

lesa();