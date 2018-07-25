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

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: '',
		database: 'smartbrain'
	}
});

// creating express app
const app = express();
//use body parser middleware 
app.use(bodyParser.json());
//use cors for middleware 
app.use(cors())
// get method to check if the app is running via nodemon
app.get('/', (req, res) => {
	// getting the database entries via the POSTMAN tool
	res.send(database.users)
})
// checking with signin page using signin profile
app.post('/signIn', (req, res) => {signIn.handleSignIn(req,res,db,bcrypt)})
// REgister - POST
app.post('/register',(req, res) => { register.handleRegister(req, res, db, bcrypt)})
//Profile with get request and ID
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
// image entries with PUT method not POST
app.put('/image',(req, res) => {image.handleImage(res, req, db)})


// listening to the app at port 3000;
app.listen(3001, () => {
	console.log('app is running at port 3001');
})