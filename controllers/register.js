
const handleRegister = (req, res, db, bcrypt) => {
	// new datbase with users
	const { email, name, password } = req.body
	if(!email || !name || !password) {
	return	res.status(400).json('Incorrect form Submission')
	}
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
}


module.exports = {
	handleRegister: handleRegister
}