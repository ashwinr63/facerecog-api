//Express for creating app server 
const express = require('express');
//import bodyparser for JSON data send via the frontend
const bodyParser = require('body-parser');
//import bcrypt for password generation and security
const bcrypt = require('bcrypt-nodejs');
// import middleware cors
const cors = require('cors');
// import knexjs for sqlprocedures
const knex = require('knex');

// import clarifai api for the server call
//const clarifai = require('clarifai')

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
//const imageurl = require('./controllers/image')

const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DATABASE_URL,
		ssl: true,
	}
});

// creating express app
const app = express();
//use body parser middleware 
app.use(bodyParser.json());
//use cors for middleware 
app.use(cors())
// get method to check if the app is running via nodemon
app.get('/', (req, res) => { res.send('it is working') })
// checking with signin page using signin profile
app.post('/signIn', signIn.handleSignIn(db, bcrypt))
// REgister - POST
app.post('/register',(req, res) => {register.handleRegister(req, res, db, bcrypt)})
//Profile with get request and ID
app.get('/profile/:id', (req, res) =>  {profile.handleProfileGet(req, res, db)})
// image entries with PUT method not POST
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
// getting imageurl for clarifai api for using server side call up
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


// listening to the app at port 3000;
app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running at port ${process.env.PORT}`)
})