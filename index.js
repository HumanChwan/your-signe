const express = require("express");
const path = require('path');
const fs = require('fs');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static('public'));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/select', (_, res) => {
    try {
        fs.readFileSync('/tmp/select.txt');
        return res.sendFile('/tmp/select.txt');
    } catch (_) {
        return res.send('random');
    }
});

app.post('/admin', (req, res) => {
    const select = req.body.select;
    try {
        fs.writeFileSync('/tmp/select.txt', select);
        return res.redirect('admin.html?done=true');
    } catch (_) {
        return res.redirect('admin.html?done=false');
    }
});

module.exports = app;

