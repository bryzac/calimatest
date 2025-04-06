const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { PAGE_URL } = require('../config');

const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken;
        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.id);
            request.user = user;
        }
    } catch (error) {
        return response.sendStatus(401);
    }
    next();
};

module.exports = { userExtractor };
