const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    nickname: String,
    country: String,
    icon: String,
    passwordHash: String,
    rol: {
        type: String,
        default: 'Visitante'
    },
    verified: {
        type: Boolean,
        default: false
    },
    birthday: String,
    birthplace: String,
    sentence: String,
    nextProjects: String,
    semblance: String,
    imageprofile: String,
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    publish: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publish'
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;