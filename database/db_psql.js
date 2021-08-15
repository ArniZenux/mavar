const pg = require('pg');

const connectionString = 'postgres://notandi:mypass@localhost/mavardb';

const pool = new pg.Pool({ connectionString });

pool.on('error', (err) => {
    console.error('error on idea client', err); 
    process.exit(-1);
});

async function query(_query, values = []){
    const client = await pool.connect(); 

    try {
        const result = await client.query(_query, values);
		//console.log('rows :>>', result.rows); 
        return result; 
    }catch(e) {
        console.log('Error setting', e); 
    }finally{
		client.release(); 
	} 
}

async function list(_query) {
	let result = []; 
	try {
		const queryResult = await query(_query);

		if (queryResult && queryResult.rows) {
			result = queryResult.rows;
		}
	} catch(e) {
		console.error('Error -- ', e); 
	}
	return result; 
}

async function insert(_query, _values){
	let success = true; 

	try {
		 await query(_query, _values);
	}
	catch(e){
		console.error('-Error inserting-', e);
		success = false;
	}
	return success; 
}

//query('SELECT * FROM tblTulkur, tblVinna, tblVerkefni WHERE tblTulkur.KT=tblVinna.KT AND tblVinna.NR=tblVerkefni.NR');

module.exports = { query, list, insert }; 