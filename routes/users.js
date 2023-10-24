const {Router} = require('express');
const {usersList,listUserByID, addUser, deleteUser,updateUser /*actualizarUser*/}=require('../controllers/users');

const router = Router();

// http://localhost:3000/api/v1/users/?
router.get('/',usersList);
router.get('/:id',listUserByID)

//router.post('/',usersList);
router.put('/',addUser);
router.patch('/:id',updateUser/*actualizarUser*/);
router.delete('/:id',deleteUser);


module.exports=router;