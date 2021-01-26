const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000
const User = require("./models/modelUser");
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("./fichiers/secret")

app.use(bodyParser.json())


app.post('/login', async (req, res) => {
    
    const user = await User.findOne({ email: req.body.email })


    if (!user || !user.comparePassword2(req.body.password)) {
        res.status(401).json({
            message: 'email or password is incorrect'
        })
    }

    else {
        const token = jwt.sign({ email: user.email, password: user.password }, JWT_SECRET, { expiresIn: '1 week' })
        res.status(400).json({
            token: token 

        })
    }
 
})

app.post('/user', (req, res) => {
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

    res.send('Le user a été créé :)')
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

    res.send('Le user a été créé :)')
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
  console.log(`Example app listening at http://localhost:${port}`)
})
