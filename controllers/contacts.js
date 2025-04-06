const contactsRouter = require('express').Router();
const User = require('../models/user');
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');

//Verify: se crea la sección de contactos del usuario verificado
contactsRouter.post('/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const user = await User.findById(id);
        const contactsExist = user.contacts.length;
        if (contactsExist === 0) {
            
            const { instagram, twitter, linktr, allmylinks, whatsapp, telegram, facebookUrl, facebook, youtubeUrl, youtube, linkedInUrl, linkedIn } = request.body;
            
            const newContact = new Contact ({
                instagram,
                twitter,
                linktr,
                allmylinks,
                whatsapp,
                telegram,
                facebookUrl,
                facebook,
                youtubeUrl,
                youtube,
                linkedInUrl,
                linkedIn,
                user: user._id,
            });
    
            const savedContact = await newContact.save();
            user.contacts = user.contacts.concat(savedContact._id);
            await user.save();
            return response.sendStatus(201);
        } 
        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
    
});

//ProfileDetails: Obtenemos los datos contacto para editar
contactsRouter.get('/', async (request, response) => {
    try {
        const user = request.user;
        const contacts = await Contact.find({ user: user.id });
        const { instagram, twitter, linktr, allmylinks, whatsapp, telegram, facebookUrl, facebook, youtubeUrl, youtube, linkedInUrl, linkedIn } = contacts[0];

        return response.status(200).json({ instagram: instagram, twitter: twitter, linktr: linktr, allmylinks: allmylinks, whatsapp: whatsapp, telegram: telegram, facebookUrl: facebookUrl, facebook: facebook, youtubeUrl: youtubeUrl, youtube: youtube, linkedInUrl: linkedInUrl, linkedIn: linkedIn });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//ProfileDetails: Subimos los cambios de los contactos
contactsRouter.patch('/', async (request, response) => {
    try {        
        const user = request.user;
        const { instagram, twitter, linktr, allmylinks, whatsapp, telegram, facebookUrl, facebook, youtubeUrl, youtube, linkedInUrl, linkedIn } = request.body;

        await Contact.findByIdAndUpdate(user.contacts[0], { instagram: `${instagram}`, twitter: `${twitter}`, linktr: `${linktr}`, allmylinks: `${allmylinks}`, whatsapp: `${whatsapp}`, telegram: `${telegram}`, facebookUrl: `${facebookUrl}`, facebook: `${facebook}`, youtubeUrl: `${youtubeUrl}`, youtube: `${youtube}`, linkedInUrl: `${linkedInUrl}`, linkedIn: `${linkedIn}` });

        return response.status(200).json('Contactos del usuario modificados');
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Profile: Obtenemos los datos contacto para mostrar en el perfil
contactsRouter.get('/:id', async (request, response) => {
    try {
        const user = request.params.id;
        const contacts = await Contact.find({ user: user});
        const { instagram, twitter, linktr, allmylinks, whatsapp, telegram, facebookUrl, facebook, youtubeUrl, youtube, linkedInUrl, linkedIn } = contacts[0];

        return response.status(200).json({ instagram: instagram, twitter: twitter, linktr: linktr, allmylinks: allmylinks, whatsapp: whatsapp, telegram: telegram, facebookUrl: facebookUrl, facebook: facebook, youtubeUrl: youtubeUrl, youtube: youtube, linkedInUrl: linkedInUrl, linkedIn: linkedIn });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

module.exports = contactsRouter;