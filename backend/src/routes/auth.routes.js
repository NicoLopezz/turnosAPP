import { Router } from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import {methods as autenthication} from "../controllers/auth.controller.js"
// import {transporter} from '../helpers/mailer.js'

const router = Router() // lets run
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// router.post("/login/:email/code", function())

router.post("/register" , autenthication.register) 

router.post("/login" , autenthication.login) 

router.get("/verify" , (req, res) => {
    res.sendFile(path.join(__dirname,"../../public/verify.html"));
})

router.get("/verify/:token" , autenthication.verifyCount) //ACA GUARDO EL TOKEN DE LA PERSONA PARA LUEGO VERIFICARLO

router.get("/allUsers" , autenthication.allUsers) //ACA GUARDO EL TOKEN DE LA PERSONA PARA LUEGO VERIFICARLO

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname,"../../public/index.html"));
});
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname,"../../public/login.html"));
});
router.get("/loginUser", (req, res) => {
    res.sendFile(path.join(__dirname,"../../public/loginUser.html"));
});

export default router;







