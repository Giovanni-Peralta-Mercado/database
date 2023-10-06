const {Router} = require('express');
const {usersList}= require('../controllers/users');

const router = Router();

// http://localhost:3000/api/v1/users/
router.get('/',usersList);

module.exports=router;