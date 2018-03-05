const auth = require('basic-auth');

const authenticate = (req, res, callback) => {
    var credentials = auth(req);
    if (!credentials || credentials.name !== process.env.USR || credentials.pass !== process.env.pass) {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else {
        callback();
    }
};

module.exports = {
    authenticate
};