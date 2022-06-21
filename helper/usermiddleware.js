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
      .withMessage('Vantar tölvupóstur')     
];

module.exports = UserMiddleware; 