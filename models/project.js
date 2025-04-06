const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    icon: String,
    artistic: String,
    image: String,
    ispublic: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    publish: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publish'
    }]
});

projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
