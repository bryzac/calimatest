const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    isAsk: {
        type: Boolean,
        default: false
    },
    publish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publish'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    askTo: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    askName: String,
    askText: String
});

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;