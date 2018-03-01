const auth = require('basic-auth');

function authenticate(req, res, callback) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== process.env.USR || credentials.pass !== process.env.pass) {
        res.status(401).set('WWW-Authenticate', 'Basic realm="example"').end('Access denied');
    } else {
        callback();
    }
}

module.exports = {
    authenticate
};