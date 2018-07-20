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
// creating basic database set of users to test the work.
const database = {
	users: [
		{
			id: '100',
			name: 'Sal',
			email: 'Sal@outlook.com',
			password: 'Salmon',
			entries: 0,
			joined: new Date()
		},
		{
			id: '101',
			name: 'Pal',
			email: 'Pal@outlook.com',
			password: 'Palmon',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'Sal@outlook.com'
		}
	]
}
// get method to check if the app is running via nodemon
app.get('/', (req, res) => {
	// getting the database entries via the POSTMAN tool
	res.send(database.users)
})
// checking with signin page using signin profile
app.post('/signIn', (req, res) => {

	return db('users').select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
			
			if (isValid) {
			return	db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('Wrong credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong Credentials'))
})
// REgister - POST
app.post('/register', (req, res) => {
	// new datbase with users
	const { email, name, password } = req.body
	const hash = bcrypt.hashSync(password)

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email,
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				//pushing the users data with database.users options
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						// getting response for the last database user created.
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
	})
		.catch(err => res.status(400).json('Unable to register'))
})
//Profile with get request and ID
app.get('/profile/:id', (req, res) => {
	// parameter id
	const { id } = req.params;
	//database condition check for each users
	db.select('*').from('users').where({ id })
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
		})
		//if the value not found return status with message
		.catch(err => res.status(400).json('error getting user'))
})

// image entries with PUT method not POST
app.put('/image', (req, res) => {
	const { id } = req.body;
	// update function from knex allows to update entries
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0])
		})
		.catch(err => res.status(400).json('Unable to get entries'))
})


// listening to the app at port 3000;
app.listen(3001, () => {
	console.log('app is running at port 3001');
})