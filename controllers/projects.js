const { PAGE_URL } = require('../config');
const axios = require('axios').default;
const projectsRouter = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');
const Publish = require('../models/publish');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');
const fs = require('node:fs');

//Profile: Publica un nuevo proyecto
projectsRouter.post('/publish', async (request, response) => {
    try {
        const { title, icon, artistic, image } = request.body;
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(200).json({ error:'Debes iniciar sesión' });
        }
        
        if (!title || !icon || !artistic) {
            return response.status(400).json({ error: 'Todos los espacios son requeridos' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
    
        const newProject = new Project ({
            title,
            icon,
            artistic,
            image,
            user: user._id
        });
    
        const savedProject = await newProject.save();
        user.projects = user.projects.concat(savedProject._id);
        await user.save();
        
        if (image !== '') {
            const imageSaved = 'project' + savedProject._id + '.' + image.split('.')[1];
            
            await Project.findByIdAndUpdate(
                savedProject._id,
                { image: imageSaved }
            );
        }

        // Enviar correo
        const subjectSend = 'projectPublish';
        const url = `project/${savedProject._id}/`
        sendEmail(user.name, user.email, subjectSend, url, user.rol, title);

        return response.status(201).json(savedProject);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
        
    }
});

//Project: Se muestran las publicaciones del proyecto
projectsRouter.get('/:id', async (request, response) => {
    try {
        const pathName = request.params.id;
        const project = await Project.findById(pathName);
        const { title } = project;

        const token = request.cookies?.accessToken;
        let decoded;
        let user;
        let logged = false;
        let rol = '';
        let userLogged = '';

        
        if (token) {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);            
            user = await User.findById(decoded.id);
            logged = true;
            rol = user.rol;
            userLogged = user.id;
        }
        let isOwner = false;
        const userID = project.user._id.toString();

        if (user?._id.toString() === userID) {
            isOwner = true;
        };

        const publishs = await Publish.find({ project: project });
        const comments = await Comment.find({ publish: publishs });

        return response.status(200).json({ title: title, publishs: publishs, isOwner, comments: comments, logged, icon: project.icon, artistic: project.artistic, image: project.image, userID: userID, rol: rol, userLogged: userLogged });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);    
    }
});

//Profile: Mostramos los proyectos del usuario en su perfil
projectsRouter.get('/profile/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const projects = await Project.find({ user: id });
        const token = request.cookies?.accessToken;
        
        let decoded;
        let user;
        if (token) {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);            
            user = await User.findById(decoded.id);
        }

        //Si es el propietario del perfil, se confirmará como tal
        let isOwner = false;
        if (user?._id.toString() === id) {
            isOwner = true;
        };

        return response.status(200).json({ projects, isOwner });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Profile: Editamos el proyecto
projectsRouter.patch('/:id', async (request, response) => {
    try {
        const project = request.params.id;
        const { title, icon, artistic } = request.body;

        await Project.findByIdAndUpdate(
            project,
            { title, icon, artistic }
        );

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);    
    }
});

//Project: Eliminamos el proyecto
projectsRouter.delete('/:id', async (request, response) => {
    try {
        //Obtenemos al usuario y el proyecto
        const userRequest = request.user;
        const projectId = request.params.id;
        const user = await User.findById(userRequest.id);
        const project = await Project.findById(projectId);

        if (user.projects.includes(projectId)) {
            //Creamos un path para encontrar la carpeta
            const pathStorage = user.id + '/' + projectId;
            //Luego vemos si existe alguna carpeta con del proyecto
            if (fs.existsSync(`./storage/${pathStorage}`)) {
                //Eliminamos la carpeta utilizando fs.rm
                fs.rm(`./storage/${pathStorage}`, {recursive: true}, (error) => {
                    if (error) {
                      console.error(error);
                      return;
                    }
                    console.log('Carpeta y su contenido eliminados con éxito');
                });
            };

            const publishs = await Publish.find({ project: projectId });
            publishs.forEach(async publish => {
                await Comment.deleteMany({ publish: publish._id });
            });
            //Eliminamos el proyecto y luego eliminamos Id del proyecto del usuario
            await Project.findByIdAndDelete(project);
            await Publish.deleteMany({ project: projectId });
            await User.updateOne({ _id: user._id }, { $pull: {projects: projectId} })
            return response.sendStatus(200);
        } else {
            console.log(error);
            return response.sendStatus(400);    
        }
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

module.exports = projectsRouter;