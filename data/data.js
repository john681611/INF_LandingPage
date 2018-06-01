const fs = require('fs');
const auth = require('../utils/auth');
const path = require('path');

const findIndex = (obj, id) => {
    return obj.findIndex(el => el.id.toString() === id.toString());
};

const writeToFileAndRedirect = (file, obj, res) => {
    fs.writeFile(file, JSON.stringify(obj, null, 4), function (error) {
        if (error) {
            res.status(500);
            res.json({ error: 'Something went wrong!' });
        }
        res.redirect('/edit');
    });
};

const addItem = (req, res, obj, file) => {
    auth.authenticate(req, res, function () {
        var item = req.body;
        if (item.id === '-1') {
            item.id = obj.length.toString();
            obj.push(item);
        } else {
            let index = findIndex(obj, item.id);
            if (index > -1) {
                obj[index] = item;
            } else {
                return res.status(404).json({ error: 'ID not found' });
            }
        }
        return writeToFileAndRedirect(file, obj, res);
    });
};

const deleteItem = (req, res, obj, file) => {
    auth.authenticate(req, res, function () {
        let index = findIndex(obj, req.body.id);
        if (index > -1) {
            obj.splice(index, 1);
        } else {
            res.status(404);
            return res.json({ error: 'ID not found' });
        }
        return writeToFileAndRedirect(file, obj, res);
    });
};

const getFile = (file) => {
    return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
};





const getData = () => {
    return {
        news: getFile('./data/newsItems.json').sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
        servers: getFile('./data/servers.json'),
        members: getFile('./data/members.json'),
        donators: getFile('./data/donators.json'),
        squads: getFile('./data/squads.json')
    };
};

module.exports = {
    addItem,
    deleteItem,
    findIndex,
    getData
};