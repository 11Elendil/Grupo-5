const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { validationResult } = require('express-validator')
//users tiene la base de usuarios

const  db = require("../../db/models")

const users = fs.readFileSync(path.resolve(__dirname, '../data/users.json'), {
  encoding: 'utf-8'
});
const usersController = {
    login: function (req, res)
    {
        return res.render('users/login')
    },
    logout: function (req, res)
    {
        req.session.destroy();
        return res.render('users/login')
    },
    
    perfil: function (req, res)
    {
        if (req.session.user){
          const user = req.session.user
          return res.render('users/perfil', {user:user})
        }
        return res.send("no estas logeado")
    },

    register: function(req, res){
        return  res.render('users/register');
      },
    
    
    create: (req, res) => {
      let errors = validationResult(req);
  
      if (errors.isEmpty()) {

            db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                typeId : req.body.type,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar:  req.file ? req.file.filename : '',
            })

            return res.render("users/login")

        } else {
          
          return res.render('users/register', {
            errors: errors.errors,  old: req.body
          });
          
            
        
        }
      },

    ingresar: async (req, res, next) =>{
        
        //let archivoUsuarios =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/users.js')));
        
        const usuarios = await db.User.findAll();

        let usuarioLogueado = usuarios.find(usuario => usuario.email == req.body.email)


        //console.log(usuarioLogueado.dataValues)

        req.session.user = usuarioLogueado.dataValues;

        if (req.session.user){
          const user = req.session.user
          return res.render('users/perfil', {user:user})
        }
        return res.send("no estas logeado")
      }
}

module.exports = usersController;
