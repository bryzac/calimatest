const commentsRouter = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');
const Publish = require('../models/publish');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');

//Project: Crea un nuevo comentario
commentsRouter.post('/:id', async (request, response) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(200).json({ error: 'Usuario no ingresado' });
        }

        const {
            text,
            isAsk,
            publish,
            askTo,
            askName,
            askText
        } = request.body;
        //Luego de haber confirmado que el usuario esté logeado, buscamos el usuario y la publicación a la cual se está comentando
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        const publishTo = await Publish.findById(publish);

        const newComment = new Comment ({
            text,
            isAsk,
            publish: publishTo._id,
            user: user._id,
            name: user.name,
            askTo: askTo,
            askName: askName,
            askText: askText
        });

        //Guardamos el nuevo comentario y lo enlazamos a la publicación
        const savedComment = await newComment.save();
        user.comment = user.comment.concat(savedComment._id);
        publishTo.comment = publishTo.comment.concat(savedComment._id);
        await user.save();
        await publishTo.save();

        
        // Enviar correo

        //Obtenemos al usuario de la publicación
        const userToMail = await User.findById(publishTo.user);
        //En caso de que sea una respuesta a un comentario
        if (askTo) {
            //Determinamos al usuario encontrando el comentario
            const commentToAsk = await Comment.findById(askTo);
            const userToAsk = await User.findById(commentToAsk.user);
            //Notificamos al usuario del comentario original que tiene una respuesta
            const subjectSend = 'askComment';
            const url = `project/${publish._id}`;
            sendEmail(user.name, userToAsk.email, subjectSend, url, user.rol, publishTo.title);
        }
        //Notificamos al dueño de la publicación que tiene nuevos comentarios
        const subjectSend = 'comment';
        const url = `project/${publish._id}`;
        sendEmail(user.name, userToMail.email, subjectSend, url, user.rol, publishTo.title);

        return response.status(200).json({ savedComment, publish: publishTo.comment });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Project: Edita un comentario
commentsRouter.patch('/:id', async (request, response) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(200).json({ error: 'Usuario no ingresado' });
        }
        const { id, editAsk } = request.body;
        //Buscamos el usuario y la publicación a la cual se está comentando
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        
        //Determinamos la autoría del comentario
        if (user.comment.includes(id)) {
            await Comment.findByIdAndUpdate(
                id, { text: editAsk }
            ); 
        } else {
            console.log(error);
            return response.sendStatus(400);    
        }

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Project: Elimina un comentario
commentsRouter.delete('/:id', async (request, response) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(200).json({ error: 'Usuario no ingresado' });
        }
        const id = request.params.id;
        //Buscamos el usuario y la publicación a la cual se está comentando
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        
        //Determinamos la autoría del comentario
        if (user.comment.includes(id)) {
            console.log('queso')
            await Comment.findByIdAndDelete(id);
            await User.updateOne({ _id: user._id }, { $pull: { comment: id } });
            await Publish.updateOne({ comment: id }, { $pull: { comment: id } });
        } else {
            console.log(error);
            return response.sendStatus(400);    
        }

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

module.exports = commentsRouter;