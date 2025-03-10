const profileDetailsRouter = require('express').Router();
const User = require('../models/user');
const Comment = require('../models/comment');

//ProfileDetails: Obtenemos los detalles del usuario
profileDetailsRouter.get('/:id', async (request, response) => {
    try {
        const pathName = request.params.id;
        const userPathName = await User.findById(pathName);
        const { name, id, email, birthplace, birthday, nextProjects, phone, nickname, icon, sentence, semblance, imageprofile } = userPathName;

        let owner = false;
        const user = request?.user;
        if (user?.id === id) {
            owner = true;
        }

        return response.status(200).json({ name: name, id: id, email: email, birthplace: birthplace, birthday: birthday, nextProjects: nextProjects, owner, phone: phone, nickname: nickname, icon: icon, sentence: sentence, semblance: semblance, imageprofile: imageprofile });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//ProfileDetails: Editamos los datos del usuario
profileDetailsRouter.patch('/', async (request, response) => {
    try {
        const user = request.user;
        const { name, email, phone, birthplace, nickname, icon, birthday, nextProjects, sentence, semblance } = request.body;

        await User.findByIdAndUpdate(user.id, { name, email, phone, birthplace, nickname, icon, birthday, nextProjects, sentence, semblance });
        
        const comments = await Comment.find({ user: user.id });
        comments.forEach(async comment => {
            await Comment.findByIdAndUpdate(comment._id, { name });
            const asks = await Comment.find({ askTo: comment.id });
            await Comment.findByIdAndUpdate(comment._id, { askName: name });
        });
        
        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
    }

});

module.exports = profileDetailsRouter;