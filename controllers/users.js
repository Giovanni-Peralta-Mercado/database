const {request,response} = require('express')

const usersList=(req = request,res=response)=>{
    res.json({msg: 'Hola Usuario,llevame con tu lider...'})

}

module.exports={usersList};