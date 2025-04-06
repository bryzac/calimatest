const navsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { PAGE_URL } = require('../config');
const Project = require('../models/project');
const Publish = require('../models/publish');


//Creamos un nav, sabiendo si se encuentra logged
navsRouter.get('/', async (request, response) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(200).json({ logged: false });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return response.status(200).json({ logged: false });
        }

        return response.status(200).json({ logged: true, name: user.name, userID: user.id, rol: user.rol });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Profile: Obtenemos información del usuario propietario del perfil
navsRouter.get('/profile/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const user = await User.findById(id);
        const { name, sentence, nickname, imageprofile, _id } = user;

        return response.status(200).json({ name: name, sentence: sentence, nickname: nickname, imageprofile: imageprofile, id: _id });
    } catch (error) {
        console.log(error);
        return response.status(404).json({ error: 'Usuario no encontrado' });
    }
});

//Project: Obtenemos la información del proyecto
navsRouter.get('/project/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const project = await Project.findById(id);

        return response.status(200).json(project);
    } catch (error) {
        console.log(error);
        return response.status(404).json({ error: 'Sección no encontrada' });
    }
});

//editPublish: Obtenemos la información de la publicación
navsRouter.get('/editPublish/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const publish = await Publish.findById(id);
        const project = await Project.findById(publish.project);

        return response.status(200).json(project);
    } catch (error) {
        console.log(error);
        return response.status(404).json({ error: 'Sección no encontrada' });
    }
});


module.exports = navsRouter;