const {Router} = require('express');
const {usersList}= require('../controllers/users');

const router = Router();

// http://localhost:3000/api/v1/users/
router.get('/',usersList);
//router.post('/',usersList);
//router.put('/',usersList);
//router.patch('/',usersList);
//router.delete('/',usersList);

module.exports=router;