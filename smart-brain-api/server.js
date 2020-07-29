// external modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// internal modules
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const PORT = process.env.PORT || 3000;

//----------------------------------DataBase---------------------------------------------

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'dangold',
        database: 'smart_brain'
    }
});

//----------------------------------Middleware---------------------------------------------
const app = express();
app.use(bodyParser.json());
app.use(cors());

//---------------------------------------GET-----------------------------------------------

app.get('/profile/:id', profile.handleProfileGet(db));

//--------------------------------------POST------------------------------------------------

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.post('/imageurl', image.handleApiCall);

//--------------------------------------PUT----------------------------------------------------

app.put('/image', image.handleImage(db));

//--------------------------------------LISTEN-------------------------------------------------

app.listen(PORT, () => console.log(`app is running on port: ${PORT}`));