const adminRouter = require('express').Router();
const User = require('../models/user');

//Admin: Obtenemos información sobre los usuarios registrados en la plataforma
adminRouter.get('/', async (request, response) => {
    try {
        const isAdmin = request?.user?.rol;
        const users = await User.find();
        
        if (isAdmin === 'Admin'){
            const usersMap = users.map(user => [
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    rol: user.rol,
                    verified: user.verified
                }
            ]);
            return response.status(200).json({usersMap})        
        } else{
            const pathName = request.rawHeaders[21].split('/admin')[0];

            return response.sendStatus(400).json({ error: 'No posees permisos de administrador', pathName });
        };

    } catch (error) {
        console.log(error);
    }
});

//Admin: Actualizamos información de los usuarios registrados en la plataforma
adminRouter.patch('/', async (request, response) => {
    try {
        const isAdmin = request.user.rol;
        
        if (isAdmin === 'Admin') {
            const { id, rol, email, phone, verified } = request.body;
            await User.findByIdAndUpdate(id, { rol, email, phone, verified });
    
            return response.sendStatus(200);
        } else {
            const pathName = request.rawHeaders[21].split('/admin')[0];
            
            return response.sendStatus(400).json({ error: 'No posees permisos de administrador', pathName });
        };
    } catch (error) {
        console.log(error);
    }
});

module.exports = adminRouter;