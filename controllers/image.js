const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
	apiKey: 'e7d4b611ae8e466592389d540f23a118'
});

const handleApiCall = (req, res) => {
	app.models
	  .predict(FACE_DETECT_MODEL, req.body.input)
	  .then(data => {
		res.json(data);
	  })
	  .catch(err => res.status(400).json('unable to work with API'))
  }

  const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
	  res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))
  }

  module.exports =  {
		handleImage,	handleApiCall
  }