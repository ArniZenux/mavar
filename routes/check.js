var { list } = require('./../database/db_psql');
const { body, validationResult } = require('express-validator');

async function ProjectCheck(req, res, next) {
  const title = 'Mávar - túlkuþjónusta';
  const subtitle = 'Bæta nýtt verkefni';
  const sql = "SELECT * FROM tblTulkur";

  const {
    heiti, dagur, stadur, timi_byrja, timi_endir, vettvangur
  } = req.body;
  
  const validation = validationResult(req);

  const rows = await list(sql); 

  if (!validation.isEmpty()) {
    return res.render('addprojects', { errors: validation.errors, title: title, subtitle: subtitle, model : rows });
  }
  
  return next();
}

async function UserCheck(req, res, next){
  const title = 'Mávar - túlkuþjónusta';
  const subtitle = 'Táknmálstúlkur';
 
  const {
    KT, nafn, simanumer, email,
  } = req.body;
  
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
      return res.render('addusers', { errors: validation.errors, title, subtitle });
  }
 
  return next();
}

module.exports = { ProjectCheck, UserCheck }; 