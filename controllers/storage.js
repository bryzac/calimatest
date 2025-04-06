const storageRouter = require('express').Router();
const multer = require('multer');
let upload = multer({ dest: 'storage' });
const fs = require('node:fs');

const User = require('../models/user');
const Project = require('../models/project');
const Publish = require('../models/publish');


//Modifica el nuevo path y el nombre del archivo
function saveFile(file, type, pathStorage, id) {
    //Seleccionamos la ubicación en la que se guardará la imagen, una carpeta para cada usuario
    //Si no existe la carpeta, se crea automáticamente
    upload = multer({ dest: `storage/${pathStorage}` });

    //Creamos un nuevo nombre
    const newName = type + id + '.' + file.originalname.split('.')[1];
    //Creamos un nuevo path
    const newPath = `./storage/${pathStorage}/${newName}`;
    //Guardamos los nuevos datos
    fs.renameSync(file.path, newPath);
    file.originalname = newName;

    return newName;
}

//ProfileDetails: Se sube una foto de perfil
storageRouter.post('/profile/:id', upload.single('imageprofileinput'), async (request, response) => {
    try {
        const userID = request.params.id;
        //Obtenemos el documento desde la página
        const file = request.file;
        //Obtenemos el nombre de la vieja foto de perfil, en caso de existir
        const user = await User.findById(userID);
        
        //Si existe alguna foto previa, la eliminamos
        if (user.imageprofile !== '') {
            const oldimage = user.imageprofile;
            fs.rmSync(`./storage/${userID}/${oldimage}`);
        };
        
        //Creamos un path que será la base para este tipo de archivos
        const pathStorage = userID;
    
        //Llamamos a la función saveFile
        const newImage = saveFile(file, 'imageprofile', pathStorage, userID);

        await User.findByIdAndUpdate(userID, { imageprofile: newImage });
        
        return response.status(201).json(newImage);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Profile: Se sube una imagen para cada proyecto
storageRouter.post('/project/:id', upload.single('imageinput'), async (request, response) => {
    try {
        const userID = request.params.id;
        const file = request.file;
        const projectID = request.body.projectID;
    
        const pathStorage = userID + '/' + projectID;
        
        const newImage = saveFile(file, 'project', pathStorage, projectID);
    
        return response.status(201).json(newImage);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Project: Se sube una imagen en el proyecto o se modifica la actual
storageRouter.patch('/project/:id', upload.single('imageinput'), async (request, response) => {
    try {
        console.log('arepa')
        const file = request.file;
        const projectID = request.params.id;
        const project = await Project.findById(projectID);
        const userID = project.user;
    
        const pathStorage = userID + '/' + projectID;
        
        const image = project.image;
    
        if (image !== '') {
            fs.rmSync(`./storage/${pathStorage}/${image}`);
        };
        
        const newImage = saveFile(file, 'project', pathStorage, projectID);

        await Project.findByIdAndUpdate(projectID, { image: newImage });
    
        return response.status(201).json(newImage);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});


//Primero determinamos qué archivos va a recibir. Nombramos a las imágenes y a los archivos de formas distintas
const cpUpload = upload.fields([
    { name: 'imageinput', maxCount: 1 },
    { name: 'fileinput', maxCount: 1 }
]);

//addPublish: Se crea una imagen y/o archivo por cada publicación
storageRouter.post('/publish/:id', cpUpload, async (request, response) => {
    try {
        let newImage;
        let newFile;
        const projectID = request.params.id;
        const project = await Project.findById(projectID);
        const userID = project.user;
        const publishID = request.body.titleinput;
    
        const pathStorage = userID + '/' + projectID + '/' + publishID;
    
        //Si se ha subido una nueva imagen
        if (request.files['imageinput']) {
            //Obtenemos la imagen
            const file = request.files['imageinput'][0];
            //Y obtenemos su nombre
            const nameFile = 'image '+file.originalname.split('.')[0];
            //Luego, enviamos el archivo para su guardado
            newImage = saveFile(file, nameFile, pathStorage, publishID);
        }
        //Si se ha subido un nuevo archivo
        if (request.files['fileinput']) {
            //Obtenemos el archivo
            const file = request.files['fileinput'][0];
            //Y obtenemos su nombre
            const nameFile = 'file '+file.originalname.split('.')[0];
            //Luego, enviamos el archivo para su guardado
            newFile = saveFile(file, nameFile, pathStorage, publishID);
        }
    
        return response.status(201).json({ newImage, newFile });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//editPublish: Se crea una imagen y/o archivo por cada publicación
storageRouter.patch('/publish/:id', cpUpload, async (request, response) => {
    try {
        let newImage;
        let newFile;
        const publishID = request.params.id;
        const publish = await Publish.findById(publishID);
        const userID = publish.user;
        const projectID = publish.project;
    
        const pathStorage = userID + '/' + projectID + '/' + publishID;
    
        if (request.files['imageinput']) {
            //En caso de ya se tenga una imagen previa
            const oldimage = publish.image;
            
            //La obtenemos en la carpeta de storage
            if (fs.existsSync(`./storage/${pathStorage}/${oldimage}`)) {
                //Y eliminamos la imagen anterior
                fs.rmSync(`./storage/${pathStorage}/${oldimage}`);
            };
    
            const file = request.files['imageinput'][0];
            const nameFile = file.originalname.split('.')[0];
            newImage = saveFile(file, nameFile, pathStorage, publishID);
            
            //Luego guardamos la nueva imagen
            await Publish.findByIdAndUpdate(
                publish._id,
                { image: newImage }
            );
        }
        if (request.files['fileinput']) {
            //En caso de ya se tenga un archivo previo
            const oldfile = publish.file;
            
            //Lo obtenemos en la carpeta de storage
            if (fs.existsSync(`./storage/${pathStorage}/${oldfile}`)) {
                //Y eliminamos el archivo anterior
                fs.rmSync(`./storage/${pathStorage}/${oldfile}`);
            };
    
            const file = request.files['fileinput'][0];
            const nameFile = file.originalname.split('.')[0];
            newFile = saveFile(file, nameFile, pathStorage, publishID);
    
            //Luego guardamos el nuevo archivo
            await Publish.findByIdAndUpdate(
                publish._id,
                { image: newFile }
            );
        }
    
        return response.status(201).json({ newImage, newFile });
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//ProfileDetails: Para eliminar la imagen de perfil
storageRouter.patch('/deleteprofile/:id', upload.single('imageprofileinput'), async (request, response) => {
    try {
        const userID = request.params.id;
        const user = await User.findById(userID);
        const imageprofile = user.imageprofile;

        if (imageprofile !== '') {
            const pathStorage = userID;
            await User.findByIdAndUpdate(userID, { imageprofile: '' });
            fs.rmSync(`./storage/${pathStorage}/${imageprofile}`);
    
            return response.sendStatus(200);
        };

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//Project: Para eliminar la imagen del proyecto
storageRouter.patch('/deleteproject/:id', upload.single('imageinput'), async (request, response) => {
    try {
        const projectID = request.params.id;
        const project = await Project.findById(projectID);
        const userID = project.user;
        const image = project.image;
        
        if (image !== '') {
            const pathStorage = userID + '/' + projectID;
            await Project.findByIdAndUpdate(projectID, { image: '' });
            fs.rmSync(`./storage/${pathStorage}/${image}`);
    
            return response.sendStatus(200);
        };

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//EditPublish: Para eliminar la imagen de la publicación
storageRouter.patch('/deletepublishimage/:id', cpUpload, async (request, response) => {
    try {
        const publishID = request.params.id;
        const publish = await Publish.findById(publishID);
        const userID = publish.user;
        const projectID = publish.project;
        const image = publish.image;

        const pathStorage = userID + '/' + projectID + '/' + publishID;
        
        if (image !== '') {
            await Publish.findByIdAndUpdate(publishID, { image: '' });
            fs.rmSync(`./storage/${pathStorage}/${image}`);
    
            return response.sendStatus(200);
        };

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

//EditPublish: Para eliminar el archivo de la publicación
storageRouter.patch('/deletepublishfile/:id', cpUpload, async (request, response) => {
    try {
        const publishID = request.params.id;
        const publish = await Publish.findById(publishID);
        const userID = publish.user;
        const projectID = publish.project;
        const file = publish.file;

        const pathStorage = userID + '/' + projectID + '/' + publishID;
        
        if (file !== '') {
            await Publish.findByIdAndUpdate(publishID, { file: '' });
            fs.rmSync(`./storage/${pathStorage}/${file}`);
    
            return response.sendStatus(200);
        };

        return response.sendStatus(200);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

module.exports = storageRouter;