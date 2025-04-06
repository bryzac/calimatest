const { PAGE_URL } = require('../config');
const axios = require('axios').default;
const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');
const Contact = require('../models/contact');
const fs = require('node:fs');
const Publish = require('../models/publish');
const Project = require('../models/project');

//Signup: creamos un nuevo usuario
usersRouter.post('/', async (request, response) => {
    // Solicita al body todos los datos
    const { name, email, phone, nickname, country, icon, password } = request.body;
    
    // En caso de que traten de acceder sin todos los datos
    if (!name || !email || !phone || !country || !icon || !password) {
        return response.status(400).json({ error: 'Todos los espacios son requeridos' });
    }
    // En caso de que el email ya esté registrado
    const userExist = await User.findOne({ email });
    if (userExist) {
        return response.status(400).json({ error: 'El email ya se encuentra en uso' });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Mandar nuevo user
    const newUser = new User ({
        name,
        email,
        phone,
        nickname,
        country,
        icon,
        passwordHash,
        birthday: '',
        birthplace: '',
        sentence: '',
        nextProjects: '',
        semblance: '',
        imageprofile: ''
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // Enviar correo
    const subjectSend = 'verify';
    const url = `verify/${savedUser.id}/${token}`;
    sendEmail(savedUser.name, savedUser.email, subjectSend, url, savedUser.rol, '');

    return response.status(201).json(['Usuario creado. Por favor, verifica tu correo', savedUser]);
});

//Visitantes: buscamos todos los usuarios con la clase Visitante
usersRouter.get('/visitantes', async (request, response) => {
    const visitantes = await User.find({ rol: 'Visitante' });
    
    const visitantesMap = visitantes.map(visitante => [
        {
            _id: visitante._id,
            name: visitante.name,
            nickname: visitante.nickname,
            icon: visitante.icon
        }
    ]);
    return response.status(200).json(visitantesMap);
});

//Profile: Obtiene la información del usuario para mostrarlo en su perfil
usersRouter.get('/profile/:id', async (request, response) => {
    try {
        const pathName = request.params.id;
        const user = await User.findById(pathName);
        const { name, id, semblance, imageprofile } = user;

        const contacts = await Contact.find({ user: id });
        const { instagram, twitter, linktr, allmylinks, whatsapp, telegram, facebookUrl, facebook, youtubeUrl, youtube, linkedInUrl, linkedIn } = contacts[0];

        return response.status(200).json({ 
            name: name, 
            id: id, 
            semblance: semblance, 
            instagram: instagram, 
            twitter: twitter, 
            linktr: linktr, 
            allmylinks: allmylinks, 
            whatsapp: whatsapp, 
            telegram: telegram, 
            facebookUrl: facebookUrl, 
            facebook: facebook, 
            youtubeUrl: youtubeUrl, 
            youtube: youtube, 
            linkedInUrl: linkedInUrl, 
            linkedIn: linkedIn,
            imageprofile: imageprofile
        });
    } catch (error) {
        console.log(error);
        return response.status(404).json({ error: 'Usuario no encontrado' });
    }
});

//Habitantes: buscamos todos los usuarios con la clase Habitante y Admin
usersRouter.get('/habitantes', async (request, response) => {
    const habitantes = await User.find({ rol: 'Habitante'});
    const admins = await User.find({ rol: 'Admin'});
    
    const habitantesMap = habitantes.map(habitante => [
        {
            _id: habitante._id,
            name: habitante.name,
            nickname: habitante.nickname,
            semblance: habitante.semblance,
            imageprofile: habitante.imageprofile
        }
    ]);
    const adminsMap = admins.map(admin => [
        {
            _id: admin._id,
            name: admin.name,
            nickname: admin.nickname,
            semblance: admin.semblance,
            imageprofile: admin.imageprofile
        }
    ]);
    return response.status(200).json({habitantesMap, adminsMap})
});

//Home: buscamos todos los usuarios con la clase Habitante y Admin para mostrar en Home
usersRouter.get('/home', async (request, response) => {
    const habitantes = await User.find({rol: 'Habitante'});
    const admins = await User.find({rol: 'Admin'});

    const habitantesMap = habitantes.map(habitante => [
        {
            _id: habitante._id,
            name: habitante.name,
            nickname: habitante.nickname,
            icon: habitante.icon
        }
    ]);
    const adminsMap = admins.map(admin => [
        {
            _id: admin._id,
            name: admin.name,
            nickname: admin.nickname,
            icon: admin.icon
        }
    ]);
    return response.status(200).json({habitantesMap, adminsMap})
});

//ProfileDetails: Eliminamos el perfil
usersRouter.delete('/:id', async (request, response) => {
    try {
        //Obtenemos al usuario
        const user = await User.findById(request.params.id);

        //Creamos un path para encontrar la carpeta
        const pathStorage = user.id;
        //Luego vemos si existe alguna carpeta del usuario
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
        //Eliminamos el usuario
        await User.findByIdAndRemove({ _id: user._id });
        await Project.deleteMany({ user: user._id });
        await Publish.deleteMany({ user: user._id });
        await Contact.findByIdAndRemove({ user: user._id });
        await Comment.deleteMany({ user: user._id });

        response.clearCookie('accessToken', {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

module.exports = usersRouter;