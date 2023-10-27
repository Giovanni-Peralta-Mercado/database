const {request,response} = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const usersModel = require('../models/users');


const usersList= async(req = request,res=response)=>{
    let conn;
    try {
        conn = await pool.getConnection();
        
        const  users = await conn.query(usersModel.getAll,(err)=>{
            if(err){
                throw new Error(err);   
            }
        })

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const listUserByID= async(req = request,res=response)=>{
    const{id}=req.params;

    if(isNaN(id)){
        res.status(400).json({msg:'Invalid ID'});
        return;
    }
    let conn;
    try {
        conn = await pool.getConnection();
        
        const [user] = await conn.query(usersModel.getByID,[id],(err)=>{  
            if(err){
                throw new Error(err);    
            }
        })

        if(!user){
            res.status(404).json({msg:'User not found'});
            return;
        }

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

const addUser = async (req = request,res = response) =>{
    const {
        username,
        email,
        password,
        name,
        lastname,
        phone_number='',
        role_id,
        is_active=1
     } = req.body;

     if(!username || !email || !password || !name || !lastname || !phone_number || !role_id){
        res.status(400).json({msg: 'Missing information'});
        return;
     }


const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);


     const user = [
        username,
        email,
        passwordHash,
        name,
        lastname,
        phone_number,
        role_id,
        is_active
    ];


    let conn;

    try {
        conn = await pool.getConnection();

        const [usernameUser] = await conn.query(
            usersModel.getByUsername,
            [username],
            (err) => {if (err) throw err;}
        );
        if(usernameUser) {
            res.status(409).json({msg:`User with username ${username} alredy exist`});
            return;
        }

        const [emailUser] = await conn.query(
            usersModel.getByEmail,
            [email],
            (err) => {if (err) throw err;}
        );
        if(emailUser) {
            res.status(409).json({msg:`User with email ${email} alredy exist`});
            return;
        }

        const userAdded = await conn.query(
            usersModel.addRow, 
            [...user], 
            (err) => {if (err) throw err;}
        );
        
        if (userAdded.affectedRows === 0) throw new Error({msg: 'Failed to add user'});

        res.json({msg: 'User added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}

//ACTUALIZACIÓN DE DATOS CREADO POR EL PROFE 
const updateUser=async(req, res)=>{
    const {
        username,
        email,
        password,
        name,
        lastname,
        phone_number,
        role_id,
        is_active
    } = req.body;

const {id} = req.params;

let passwordHash;

if (password){
    const saltRounds = 10;
    passwordHash = await bcrypt.hash(password,saltRounds);
}

let newUserData=[
    username,
    email,
    passwordHash,
    name,
    lastname,
    phone_number,
    role_id,
    is_active  
];
let conn;
try{
    conn = await pool.getConnection();
const [userExists]=await conn.query(
    usersModel.getByID,
    [id],
    (err) => {if (err) throw err;}
);
if (!userExists || userExists.id_active === 0){
    res.status(404).json({msg:'User not found'});
    return;
}

const [usernameUser] = await conn.query(
    usersModel.getByUsername,
    [username],
    (err) => {if (err) throw err;}
);
if (usernameUser){
    res.status(409).json({msg:`User with username ${username} already exists`});
    return;
}

const [emailUser] = await conn.query(
    usersModel.getByEmail,
    [email],
    (err) => {if (err) throw err;}
);
if (emailUser){
    res.status(409).json({msg:`User with email ${email} already exists`});
    return;
}

const oldUserData = [
    userExists.username,
    userExists.email,
    userExists.password,
    userExists.name,
    userExists.lastname,
    userExists.phone_number,
    userExists.role_id,
    userExists.is_active  
];

newUserData.forEach((userData, index)=> {
    if (!userData){
        newUserData[index] = oldUserData[index];
    }
})

const userUpdate = await conn.query(
    usersModel.updateRow,
    [...newUserData, id],
    (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
    throw new Error ('User not updated');
}
res.json({msg:'User updated successfully'})
}catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}


/*

//ACTUALIZACIÓN DE DATOS CREADO POR GIOVANNI DE JESUS PERALTA MERCADO

const actualizarUser = async (req = request, res = response) => {
    const { id } = req.params;

    //Aqui comprueba de que no falte informacion, sino nos mandara un mensaje indicando esto
    const {
        username,
        email,
        password,
        name,
        lastname,
        phone_number,
        role_id,
        is_active
    } = req.body;

    if (!username || !email || !password || !name || !lastname || !phone_number || !role_id || !is_active) {
        res.status(400).json({ msg: 'Missing information' });
        return;
    }

    const user = [username,email,password,name,lastname,phone_number,role_id,is_active];

    let conn;
    

    try {
        

        //Comprueba de que el usuario exista 
        conn = await pool.getConnection();

        const [VerificarUser] = await conn.query(
            usersModel.getByID,
            [id],
            (err) => { if (err) throw err; }
        );
        //sino nos manda un mensaje de que no existe

        if (!VerificarUser) {
            res.status(404).json({ msg: `User with ID ${id} not found` });
            return;
        }

        //para verificar si el username ya existe.
        

        const [UsernameOcupado] = await conn.query(
            usersModel.getByUsername,
            [username],
            (err) => { if (err) throw err; }
        );
 
        //para verificar si se ha encontrado un username ocupado y si ese 
        //username ocupado no pertenece al mismo usuario que se está tratando de actualizar

        if (UsernameOcupado && UsernameOcupado.id !== id) {
            res.status(409).json({ msg: `User with username ${username} already exists` });
            return;
        }

        //para verificar si el email ya existe.
        
        const [EmailOcupado] = await conn.query(
            usersModel.getByEmail,
            [email],
            (err) => { if (err) throw err; }
        );

        //para verificar si se ha encontrado un correo electrónico ocupado y si ese 
        //correo electrónico ocupado no pertenece al mismo usuario que se está tratando de actualizar 

        if (EmailOcupado && EmailOcupado.id !== id) {
            res.status(409).json({ msg: `User with email ${email} already exists` });
            return;
        }

        //Aqui hace la modificacion de los datos

        const updatedUser = await conn.query(
            usersModel.updateRow,
            [...user,id],
            (err) => { if (err) throw err; }
        );

        if (updatedUser.affectedRows === 0) {
            throw new Error({ msg: 'Failed to update user' });
        }

        //Si todo sale bien nos dira que se actualizo correctamente

        res.json({ msg: 'updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

*/


const deleteUser = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {id} = req.params;

        const [userExists] = await conn.query(
            usersModel.getByID,
            [id],
            (err) => {if (err) throw err;}
        );

        if (!userExists|| userExists.is_active === 0){
            res.status(404).json({msg:'User not found'});
            return;
        }

        const userDelete = await conn.query(
            usersModel.deleteRow,
            [id],
            (err) => {if (err) throw err;}
        );

        if (userDelete.affectedRows === 0) 
            throw new Error ({msg: 'Failed to delete user'});

        res.json({msg: 'User deleted succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error); 
    }finally{
        if (conn) conn.end();
    }
}


const signIn = async (req = request, res = response) => {
    
    let conn;
    const {username, password} = req.body;
    
    if (!username || !password ){
        res.status(400).json({msg: 'Username and Password are required'});
        return;
    }

   

    try {
    conn = await pool.getConnection();

    const [user] = await conn.query(
        usersModel.getByUsername, 
        [username],
        (err) => {if (err) throw err;}
    )

    if (!user || !user.is_active === 0 ){
        res.status(404).json({msg: 'Wrong username or password'});
        return;
    }

    const passwordOk = bcrypt.compare(password, user.password);
    if (!passwordOk){
        res.status(404).json({msg: 'Wrong username or password'});
        return;
    }

    delete user.password;
    delete user.created_at;
    delete user.updated_at;

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }

}

module.exports={
    usersList,
    listUserByID,
    addUser,
    deleteUser,
    updateUser,
    signIn
    /*actualizarUser*/
};