const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')
const morgan = require('morgan')

const app = express();



  //database

  //midelware
  app.use(express.json())
  app.use(cors());
  app.use(morgan("tiny"));

  //simple route
   app.get('/', (req,res)=>{
       res.json({message:"Welcome to Startup Door"})
   })

  //routes
  app.use("/auth",require("./routes/jwtAuth"))

  //set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})