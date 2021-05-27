require('dotenv').config()
const {SECRET} = process.env
const jwt = require('jsonwebtoken')
const auth = async(req,res,next) => {
    //Authorization: "bear jtyuuyxcxcxcxcxx"
  try {
    if (req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1] 
        console.log(req.headers.authorization)
        const payload = await jwt.verify(token,SECRET)
        if(payload){
            req.payload = payload
            next()

        }else{
            res.status(400).json({error: 'Verification failed or no payload'})
        }
     }else{
         res.status(400).json({error:"NO Authorization"})
     }
      
  } catch (error) {
      res.status(400).json({error})
  }
}

module.exports = auth