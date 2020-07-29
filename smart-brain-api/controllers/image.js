const Clarifai = require('clarifai');
const clarifaiApp = new Clarifai.App({ apiKey: '7afab30b06054ba788c0b6203a6460e5' });
const FACE_RECOGNITION_MODEL = "a403429f2ddf4b49b307e318f00e528b";

const handleApiCall = (req, res) => {
    clarifaiApp.models.predict(FACE_RECOGNITION_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = { handleImage, handleApiCall };