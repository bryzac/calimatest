const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    instagram: String,
    twitter: String,
    linktr: String,
    allmylinks: String,
    whatsapp: String,
    telegram: String,
    facebookUrl: String,
    facebook: String,
    youtubeUrl: String,
    youtube: String,
    linkedInUrl: String,
    linkedIn: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;