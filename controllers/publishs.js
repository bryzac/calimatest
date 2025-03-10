const { PAGE_URL } = require('../config');
const axios = require('axios').default;
const publishsRouter = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');
const Publish = require('../models/publish');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');
const fs = require('node:fs');


//AddPublish: Obtenemos información de la publicación 
publishsRouter.get('/:id', async (request, response) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(404).json({ error: 'Usuario no ingresado' })
        }

        //Obtenemos el id del proyecto
        const pathName = request.params.id;
        const project = await Project.findById(pathName);
        const user = await User.findById(request.user._id);
        
        //Determinamos la autoría del proyecto
        if (!user.projects.includes(pathName)) {
            return response.status(400).json({ error: 'Usuario no es propietario' })
        };

        return response.status(200).json(project);
        
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//AddPublish: Creamos una nueva publicación
publishsRouter.post('/:id', async (request, response) => {
    try {
        const {
            title,
            dedicatory,
            epigraph,
            epigraphBy,
            text,
            image,
            date,
            additional,
            nominations,
            awards,
            link,
            file,
            ispublic
        } = request.body;
        
        const token = request.cookies?.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        const pathName = request.rawHeaders[27].split('/')[4];
        const project = await Project.findById(pathName);
        
        const newPublish = new Publish ({
            title,
            dedicatory,
            epigraph,
            epigraphBy,
            text,
            image,
            date,
            additional,
            nominations,
            awards,
            link,
            file,
            ispublic,
            user: user._id,
            project: project._id
        });
        
        const savedPublish = await newPublish.save();
        project.publish = project.publish.concat(savedPublish._id);
        user.publish = user.publish.concat(savedPublish._id);
        await project.save();
        await user.save();
        
        if (image !== '') {
            const imageSaved = 'image '+image.split('.')[0] + savedPublish._id + '.' + image.split('.')[1];
            await Publish.findByIdAndUpdate(
                savedPublish._id,
                { image: imageSaved }
            );
        }
        if (file !== '') {
            const fileSaved = 'file '+file.split('.')[0] + savedPublish._id + '.' + file.split('.')[1];
            await Publish.findByIdAndUpdate(
                savedPublish._id,
                { file: fileSaved }
            );
        }
        
        // Enviar correo
        const subjectSend = 'newPublish';
        const url = `project/${project}/`
        sendEmail(user.name, user.email, subjectSend, url, user.rol, title);

        return response.status(201).json(savedPublish);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//EditPublish: Obtenemos información de la publicación a editarse
publishsRouter.get('/edit/:id', async (request, response) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(404).json({ error: 'Usuario no ingresado' })
        }
        
        //Obtenemos el id de la publicación
        const pathName = request.params.id;
        const publish = await Publish.findById(pathName);
        const user = await User.findById(request.user._id);

        //Determinamos la autoría de la publicación
        if (!user.publish.includes(pathName)) {
            return response.status(400).json({ error: 'Usuario no es propietario' })
        };

        return response.status(200).json(publish);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//EditPublish: Editamos la información de la publicación
publishsRouter.patch('/edit/:id', async (request, response) => {
    try {
        const userRequest = request.user;
        const publish = request.params.id;
        const user = await User.findById(userRequest.id);
        const { title, dedicatory, epigraph, epigraphBy, text, date, additional, nominations, awards, link, ispublic } = request.body;

        //Determinamos la autoría de la publicación
        if (user.publish.includes(publish)) {
            await Publish.findByIdAndUpdate(
                publish,
                { title, dedicatory, epigraph, epigraphBy, text, date, additional, nominations, awards, link, ispublic }
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

//EditPublish: Eliminamos la publicación
publishsRouter.delete('/:id', async (request, response) => {
    try {
        //Obtenemos al usuario y la publicación
        const userRequest = request.user;
        const publishID = request.params.id;
        const user = await User.findById(userRequest.id);
        const publish = await Publish.findById(publishID);

        if (user.publish.includes(publishID)) {
            //Creamos un path para encontrar la carpeta
            const pathStorage = user.id + '/' + publish.project + '/' + publishID;
            //Luego vemos si existe alguna carpeta con de la publicación
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
            //Eliminamos la publicación y luego eliminamos Id de la publicación del usuario
            await Publish.findByIdAndDelete(publish);
            await User.updateOne({ _id: user._id }, { $pull: {publish: publishID} })
            await Comment.deleteMany({ publish: publishID });
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

module.exports = publishsRouter;
