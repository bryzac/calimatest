const resetPasswordRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utilities/sendEmail');

//ResetPassword: Envía el link para el cambio de contraseña al correo del usuario
resetPasswordRouter.post('/', async (request, response) => {
    const { email } = request.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        return response.status(400).json({ error: 'El usuario no existe' });
    }

    const userForToken = {
        id: user.id
    };
    const resetToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    
    // Enviar correo
    const subjectSend = 'resetPassword';
    const url = `resetPassword/${resetToken}`;
    sendEmail(user.name, email, subjectSend, url, user.rol, '');

    return response.sendStatus(200);
});

//ResetPassword: Confirma el acceso a la página de cambio de contraseña
resetPasswordRouter.get('/:token', async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //Si no existe el token
        if (!decodedToken) {
            return response.status(404).json({ error: 'Token no encontrado' });
        }

        return response.sendStatus(200)
    } catch (error) {
        console.log(error);
        return response.status(404).json({ error: 'Token no encontrado' });
    }
});

//ResetPassword: Modifica la contraseña por la nueva
resetPasswordRouter.patch('/:token', async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decodedToken.id;
        const { password } = request.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
    
        await User.findByIdAndUpdate(id, { passwordHash });
        return response.sendStatus(200)
    } catch (error) {
        console.log(error);
        return response.status(404).json({ error: 'Token no encontrado' });
    }
});

module.exports = resetPasswordRouter;