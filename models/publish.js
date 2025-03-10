const mongoose = require('mongoose');

const publishSchema = new mongoose.Schema({
    title: String,
    dedicatory: String,
    epigraph: String,
    epigraphBy: String,
    text: String,
    date: String,
    additional: String,
    nominations: String,
    awards: String,
    link: String,
    image: String,
    file: String,
    ispublic: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

publishSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Publish = mongoose.model('Publish', publishSchema);

module.exports = Publish;