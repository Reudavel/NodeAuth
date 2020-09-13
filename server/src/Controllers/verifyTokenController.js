 const jwt = require (`jsonwebtoken`);
const { llave } = require("../configs/configs");

 function verifyToken (req, res, next){
     const token = req.headers[`x-access-token`];
     if(!token){
         return res.status(401).json({
             auth: false,
             message: `token no valido?`
         });
     }
     const decoded = jwt.verify(token, llave);
     req.userId = decoded.id;
     next();
 }

 module.exports = verifyToken;