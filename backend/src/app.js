import express from 'express'
import cors from 'cors'
import AuthRoutes from './routes/auth.routes.js'
import setInterval from './pinging.js'
const app = express() 


app.use(setInterval)
app.set('port' , process.env.PORT || 10001); 
app.use(express.json());
app.use(express.text()); 
app.use(cors())
app.use("/api" , AuthRoutes); 
app.use(express.static("public"))


export default app;










