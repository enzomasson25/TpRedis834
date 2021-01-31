const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000
const User = require("./models/modelUser");
const jwt = require("jsonwebtoken")
const JWT_SECRET = 'super secret string oulala'

app.use(bodyParser.json())


app.get('/testToken', (req, res) =>{
    const token = req.header('Authorization').replace('Bearer ', '')
    
    try{
        const payload = jwt.verify(token, JWT_SECRET) 
        console.log(payload._id)
        res.send('Authorization fait avec succès')
    } catch(error) {
        console.error(error.message)
        res.send('Vous n\'avez pas accès !')
    }
})

app.post('/login', async (req, res) => {
    
    const user = await User.findOne({ email: req.body.email })


    if (!user || !user.comparePassword2(req.body.password)) {
        res.send('Le mot de passe est incorrecte')
    }

    else {
        const token = jwt.sign({ email: user.email, password: user.password }, JWT_SECRET, { expiresIn: '1 week' })
        res.send(token)
    }
 
})

app.post('/register', (req, res) => {
    var user = new User({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password
    });

    // save user to database
    user.save(function (err) {
        if (err) throw err;
    });

    res.send('Le user est bien enregistrer :)')
})

app.get('/createUser', (req, res) => {
    // create a user a new user
    var testUser = new User({
        name: 'elhamar',
        firstname: 'jamar',
        email: 'jmar777@gmail.com',
        password: 'Password123'
    });

    // save user to database
    testUser.save(function (err) {
        if (err) throw err;
    });

    res.send('Le user est bien enregistrer :)')
})

app.get('/testMdp', (req, res) => {
    // fetch user and test password verification
    User.findOne({ email: 'jmar777@gmail.com' }, function (err, user) {
        if (err) throw err;

        // test a matching password
        user.comparePassword('Password123', function (err, isMatch) {
            if (err) throw err;
            console.log('Password123:', isMatch); // -> Password123: true
        });

        // test a failing password
        user.comparePassword('123Password', function (err, isMatch) {
            if (err) throw err;
            console.log('123Password:', isMatch); // -> 123Password: false
        });
    });

    res.send('Ca roule')
    
})

app.get('/oui', (req, res) => {
    res.send('non!')
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

var mongoose = require('mongoose');

var connStr = 'mongodb://localhost:27017/mongoose-bcrypt-test';
mongoose.connect(connStr, function (err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});


app.listen(port, () => {
  console.log('App listening at http://localhost:${port}')
})
