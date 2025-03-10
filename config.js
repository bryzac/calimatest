const PAGE_URL = process.env.NODE_ENV === 'production'
? 'placeholder'
: 'http://localhost:9009';

module.exports = {  PAGE_URL };

