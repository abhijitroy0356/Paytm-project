const {JWT_SERECT} = require("./config")
const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next)=>{
    const autorization = req.headers.autorization

    if(!autorization){
        return res.status(400).json(
            {
                msg:"no token provided"
            }
        )
    }
    try{
        const decoded = jwt.verify(autorization, JWT_SERECT);
        if(decoded.username){
            req.username= decoded.username;
            next()
        }
       
    }catch(err){
        return res.stats(403).json({
            msg:"not correct jwt"
        })
    }
}

module.exports=authMiddleware
