const fs =  require('fs');
const auth = require('../utils/auth');



function addItem(req, res, obj, file) {
    auth.authenticate(req, res, function () {
        var item = req.body;
        if (item.id === '-1') {
            item.id = obj.length.toString();
            obj.push(item);
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

function deleteItem(req, res, obj, file) {
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
    return obj.findIndex(el => el.id == id);
}


function getData() {
    delete require.cache['./newsItems.json'];
    delete require.cache['./servers.json'];
    delete require.cache['./members.json'];
    delete require.cache['./donators.json'];
    const news = require('./newsItems.json').sort((a,b)=>Date.parse(b.date) - Date.parse(a.date));
    return {
        news,
        servers: require('./servers.json'),
        members: require('./members.json'),
        donators: require('./donators.json'),
        squads: require('./squads.json')
    };
}

module.exports = {
    addItem,
    deleteItem,
    findIdx,
    getData
};