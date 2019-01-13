const auth = require('basic-auth');

const authenticate = (req, res, callback) => {
    var credentials = auth(req);
    if (!credentials || credentials.name !== process.env.USR || credentials.pass !== process.env.PASS) {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    } else {
        callback();
    }
};

const authenticateMember  = (req, res, callback) => {
    if (! req.body ||  req.body.name !== process.env.MEMUSR ||  req.body.pass !== process.env.MEMPASS) {
        callback(false);
    } else {
        callback(true);
    }
};

module.exports = {
    authenticate,
    authenticateMember
};