const fs =  require('fs');
const auth = require('../utils/auth');



function saveSomething(req, res, obj, file, unshift) {
    auth.authenticate(req, res, function () {
        var item = req.body;
        if (item.id === '-1') {
            item.id = obj.length;
            if (unshift) {
                obj.unshift(item);
            } else {
                obj.push(item);
            }
        } else {
            let idx = findIdx(obj, item.id);
            if (idx > -1) {
                obj[idx] = item;
            } else {
                return res.status(404).json({ error: 'ID not found' });
            }
        }
        fs.writeFile(file, JSON.stringify(obj, null, 4), function (error) {
            if (error) {
                res.status(500);
                return res.json({ error: 'Something went wrong!' });
            }
            res.redirect('/edit');
        });
    });
}

function deleteSomething(req, res, obj, file) {
    auth.authenticate(req, res, function () {
        let idx = findIdx(obj, req.body.id);
        if (idx > -1) {
            obj.splice(idx, 1);
        } else {
            res.status(404);
            return res.json({ error: 'ID not found' });
        }
        fs.writeFile(file, JSON.stringify(obj, null, 4), function (error) {
            if (error) {
                res.status(500);
                return res.json({ error: 'Something went wrong!' });
            }
            return res.redirect('/edit');
        });
    });
}

function findIdx(obj, id) {
    return obj.findIndex(el => el.id === id);
}




module.exports = {
    saveSomething: saveSomething,
    deleteSomething: deleteSomething,
    findIdx: findIdx,
    news: require('./newsItems.json'),
    servers: require('./servers.json'),
    members: require('./members.json'),
    donators: require('./donators.json'),
    squads: [{id:'A',name:'Alpha'},{id:'B',name:'Bravo'}]
};