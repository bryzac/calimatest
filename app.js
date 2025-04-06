require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./controllers/users');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const verifyRouter = require('./controllers/verify');
const loginRouter = require('./controllers/login');
const resetPasswordRouter = require('./controllers/resetPassword');
const logoutRouter = require('./controllers/logout');
const navsRouter = require('./controllers/navs');
const { userExtractor } = require('./middleware/auth');
const profileDetailsRouter = require('./controllers/profileDetails');
const contactsRouter = require('./controllers/contacts');
const projectsRouter = require('./controllers/projects');
const adminRouter = require('./controllers/admin');
const publishsRouter = require('./controllers/publishs');
const commentsRouter = require('./controllers/comments');
const storageRouter = require('./controllers/storage');
const { MONGO_URI } = require('./config');

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log(error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rutas frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));
app.use('/resetPassword', express.static(path.resolve('views', 'resetPassword')));
app.use('/resetPassword/:token', express.static(path.resolve('views', 'resetPassword')));
app.use('/images', express.static(path.resolve('img')));
app.use('/components', express.static(path.resolve('views', 'components')));

app.use('/profile', express.static(path.resolve('views', 'profile')));
app.use('/profile/:id', express.static(path.resolve('views', 'profile')));
app.use('/project', express.static(path.resolve('views', 'project')));
app.use('/project/:id', express.static(path.resolve('views', 'project')));
app.use('/profileDetails', express.static(path.resolve('views', 'profileDetails')));
app.use('/profileDetails/:id', express.static(path.resolve('views', 'profileDetails')));
app.use('/visitantes', express.static(path.resolve('views', 'visitantes')));
app.use('/habitantes', express.static(path.resolve('views', 'habitantes')));
app.use('/contacto', express.static(path.resolve('views', 'contacts')));
app.use('/admin/:id', express.static(path.resolve('views', 'admin')));
app.use('/addPublish/:id', express.static(path.resolve('views', 'addPublish')));
app.use('/editPublish/:id', express.static(path.resolve('views', 'editPublish')));


app.use(morgan('tiny'));

// Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/users/verify', verifyRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/resetPassword', resetPasswordRouter);

app.use('/api/navs', navsRouter);
app.use('/api/users/profileDetails', userExtractor, profileDetailsRouter);
app.use('/api/users/contact', userExtractor, contactsRouter);
app.use('/api/project', userExtractor, projectsRouter);
app.use('/api/admin', userExtractor, adminRouter);
app.use('/api/publish', userExtractor, publishsRouter);
app.use('/api/comment', userExtractor, commentsRouter);


app.use('/storage', express.static(path.resolve('storage')));
app.use('/storage', storageRouter);

module.exports = app;