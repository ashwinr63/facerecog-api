const handleProfileGet = (req, res, db) => {
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
}


module.exports = {
	
	handleProfileGet
}