const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');


//Express config
const app = express();
const port = 5000;

//Database connetcions
require(`./configs/db-connection`);


//JWT Config
const config = require('./configs/configs.js');
app.set('llave', config.llave);

//Uninstall bodyParser xD
app.use(express.json()); //To get data from the client in json format
app.use(express.urlencoded({extended: false}));

//START EXPRESS
app.listen(port, ()=>{
    console.log(`Runing in port ${port}`)
})

//Allow cors for dev test
app.use(cors());


//Middleware mover a nueva carpeta?
const rutasProtegidas = express.Router(); //Client Req ! Validate token ! API Router type
//Para cada ruta es un parametro request handler? si esta este validara si el token es valido antes de pasar a la ruta real
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

//Routes mover a otro archivo?
const verifyToken = require('./Controllers/verifyTokenController')
//Register user INSERT EXAMPLE
const User = require(`./Models/User`);
const { llave } = require('./configs/configs.js');
app.post("/SignUp", async (req, res, next) => {
    try {    
        const {username, password} = req.body; //Sintax of object deconstruction    
        const user = new User({
            username: username,
            password: password
        })
        user.password = await user.encryptPassword(user.password);
        console.log(user); 
        await user.save();
        const token = jwt.sign({ id: user._id }, llave, {
            expiresIn: 86400
        })

        res.json({auth: true, token: token});
    } catch (error) {
        console.log(error);
    }
})

//Home 
app.get('/Home', verifyToken, async (req, res, next) => {
    /*const token = req.headers['x-access-token'];
    if (!token){
        return res.status(401).json({
            auth: false,
            message: `No token provided`
        })
    }
   const decoded = jwt.verify(token, llave);
   console.log(decoded);*/
   const user = await User.findById(req.userId ,{password:0});

   
   if (!user){
        return res.status(404).send('No user found');
   }
   res.json(user);
   });

//Login Auth
app.post('/SignIn', async (req, res) => {
  console.log(req.body);
    const {username, password} = req.body;
    const user = User.findOne({username: username})
    if (!user){
        return res.status(401).send("User not found");
    }

    const validation = await user.validatePassword(password);
    if(!validation){
        return res.status(401).json({auth: false, token: null});
    }
        const token = jwt.sign({id: user._id}, llave, {
            expiresIn: 86400
        });

    res.json({auth: true, token: token});

   /* if(!user) {
  const payload = {
   check:  true
  };
  const token = jwt.sign(payload, app.get('llave'), {
   expiresIn: 1440
  });
  res.json({
   mensaje: 'Autenticación correcta',
   token: token
  });
    } else {
        res.json({ mensaje: "Usuario o contraseña incodsdsdsdsdsdsrrectos"+req.body.usuario+"****"})
    }*/
});


//API get example 
app.get('/datos', rutasProtegidas, (req, res) => {
    const datos = [
     { id: 1, nombre: "Asfo" },
     { id: 2, nombre: "Denisse" },
     { id: 3, nombre: "Carlos" }
    ];
    
    res.json(datos);
   });

//Confirm email

//Google login

//Facebook login

//Forgot password

//Changue password
