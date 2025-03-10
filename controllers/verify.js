const verifyRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');

//Verify: Se modifica el estado del usuario a verificado
verifyRouter.patch('/:id/:token', async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decodedToken.id;
        await User.findByIdAndUpdate(id, { verified: true });
        return response.sendStatus(200);
        
    } catch (error) {
        //Encontrar el email del usaurio
        const id = request.params.id;
        const { name } = await User.findById(id);
        const { email } = await User.findById(id);

        // Firmar el nuevo token
        const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // Enviar correo
        const subjectSend = 'verify';
        const url = `verify/${id}/${token}`;
        sendEmail(name, email, subjectSend, url);

        return response.status(400).json({ error: 'El link ya expiró. Se ha enviado un nuevo link de verificación a su correo.' });
    }
});

module.exports = verifyRouter;