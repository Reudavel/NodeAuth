
const {Router , rutasProtegidas} = require(`express`);
const router = Router();

const rutasProtegidas = express.Router(); //Client Req ! Validate token ! API
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
//Register user INSER EXAM´LE
router.post("/SignUp", async (req, res)=>{
    try {
        console.log(req.body);
        const {username, pasword, email} = req.body; //Sintax of object deconstruction
        const createUser = await pool.query("INSER INTO ...");
        res.json(createUser);
    } catch (error) {
        console.log(error);
    }
})
//Login Auth
router.post('/SignIn', (req, res) => {
  console.log(req.body);
    if(req.body.usuario === "asfo" && req.body.contrasena === "holamundo") {
  const payload = {
   check:  true
  };
  const token = jwt.sign(payload, router.get('llave'), {
   expiresIn: 1440
  });
  res.json({
   mensaje: 'Autenticación correcta',
   token: token
  });
    } else {
        res.json({ mensaje: "Usuario o contraseña incodsdsdsdsdsdsrrectos"+req.body.usuario+"****"})
    }
});
//API get example 
router.get('/datos', rutasProtegidas, (req, res) => {
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