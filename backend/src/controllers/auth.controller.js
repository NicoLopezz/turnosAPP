// import { ok } from 'assert';
import Usuario from '../models/Users.js'
import bcrypt from 'bcryptjs'
import {sendEmailVerification} from '../helpers/mailer.js'
import jsonwebtoken from 'jsonwebtoken'
import {config} from 'dotenv'
// import { Verify } from 'crypto';
// import { CookieJar } from 'fetch';

config();

async function register(req,res){
  const errors = [];
  const newUsuario = new Usuario({
    Name: req.body.Name , 
    Surname: req.body.Surname, 
    Email: req.body.Email,
    Company: req.body.Company,
    Country: req.body.Country, 
    Pass: req.body.Pass,
    Verify: false,
  })
  
  const passHashusser = await bcrypt.hash(newUsuario.Pass , 10 )
  const emailUser = await Usuario.findOne({Email: newUsuario.Email})
 
    // if (newUsuario.Pass.length < 4 ) {
    //   console.log("al menos 4 letras en al contraseña")
    //   return errors.push({text:'Passwords must be at least 4 characters'})
    // }

    if(!newUsuario.Name || !newUsuario.Surname || !newUsuario.Pass){
      return res.status(400).send({status:"Error",message:"Los campos están incompletos"})
    }

    if (emailUser){
      console.log(newUsuario.Email)
      return res.status(400).send({status:"Error",message:"Email ya registrado"})
    }

    //create JWT
    const token = jsonwebtoken.sign(
      {userMail:newUsuario.Email}, process.env.JWT_SERCRET_KEY, {expiresIn:process.env.JWT_EXPIRE})

    //create cookie
    const cookieOptions = {
      expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ),
      path: "/"
    }

    res.cookie("jwt",token,cookieOptions)

      //mail check send
      const mail = await sendEmailVerification(newUsuario.Email, token)
      console.log("el token creado es  " + token)
  
    //  if(mail.accepted===0){
    //   return res(500).send({status:"error" , message: "error email to send verification"})
    //  }

     //save user
      newUsuario.Pass = passHashusser;
      newUsuario.save();
      console.log(newUsuario)
      return res.status(201).json({ status: "Success", message: "Usuario registrado correctamente", redirect: "/api/login" })
}

async function login (req ,res){
  const newUsuario = new Usuario({
    Email: req.body.Email,
    Pass: req.body.Pass})
    //return user from db
    const userDb = await Usuario.findOne({Email: newUsuario.Email})
    if(userDb){
      //chequeo que el mail ingresado exista
      //create JWT (AGREGO PARA QUE VIAJE EL EMAIL EN EL JWT)
          const token = jsonwebtoken.sign(
            {userMail:newUsuario.Email}, process.env.JWT_SERCRET_KEY, {expiresIn:process.env.JWT_EXPIRE})
      
          //create cookie 
          const cookieOptions = {
            expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 ),
            path: "/"
          }
          res.cookie("jwt",token,cookieOptions)
           
      //check hashes
      const isMatch = await bcrypt.compare(req.body.Pass, userDb.Pass)
  
      if(!userDb.Verify)
         return res.status(401).json({status: "not logged" , message: "not valid email usser"}) 
  
      if (userDb && newUsuario.Email==userDb.Email && isMatch){
        console.log("user loged with: " + newUsuario.Email )
        return res.status(201).json({ status: "logeado", message: `Usser mail ${newUsuario.Email} susccesfull` , redirect:"/api/verify"})
  
        //REDIRIGIR LUEGO DE LOGEAR CORRECTAMENTE !!! 
  
      }else{
        res.status(401).send({status:"Error",message:"Las contraseñas no coinciden"})
      }

    }else{
      return res.status(401).send({status:"Error",message:"Email not exist in database"})
    }
}

async function verifyCount(req,res){
    //capturo el jwt de mi cookie de mi header
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    console.log(cookieJWT)
    const decodificate = jsonwebtoken.verify(cookieJWT, process.env.JWT_SERCRET_KEY)
    
    console.log(`el valor de decodificada es ${decodificate.userMail}`)
    
    const userDb = await Usuario.findOne({Email:decodificate.userMail})
    console.log("valor del usuario verificado " + userDb.Verify)
    userDb.Verify = true
    userDb.save()
    console.log("valor del usuario verificado " + userDb.Verify)
    res.redirect("/api/verify")
    
    // if(!decodificate || !decodificate.mail){––
    //   res.status(500);
    //   res.redirect("/").send({status:"error" , message: "error in token"})
    // }

    // // create JWT
    // const token = jsonwebtoken.sign(
    //   {userMail:decodificate.mail}, process.env.JWT_SERCRET, {expiresIn:process.env.JWT_SERCRET})
        
    // //create cookie
        
    // const cookieOptions = {
    //   expire: new Date(Date.now() + process.env.JWT_COOKIRE_EXPIRE * 24 * 60 * 60 * 1000 ),
    //   path: "/"
    // }
        
    // res.cookie("jwt",token,cookieOptions)
    // res.redirect("/verify")



  // } catch (error) {
  //   res.status(500);
  //   console.log("hay un error en cathc!")
  //   res.redirect("/")
  // }
}

async function allUsers(req, res){

  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const methods = {
    register,
    login,
    verifyCount,
    allUsers,
  }



