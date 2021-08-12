const pg = require('pg');
//import pg from 'pg';

const connectionString = 'postgres://notandi:mypass@localhost/mavardb';

//const client = new Client( {connectionString });
//client.connect(); 

const pool = new pg.Pool({ connectionString });

pool.on('error', (err) => {
    console.error('error on idea client', err); 
    process.exit(-1);
});

async function main(){
    const client = await pool.connect(); 

    try {
        const result = await client.query('SELECT * FROM test;');
        console.log('rows :>>', result.rows); 
    }catch(e) {
        console.log('Error setting', e); 
    }
    
}

main(); 