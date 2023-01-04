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
    res.sendFile(path.join(__dirname, 'select.txt'));
});

app.post('/admin', (req, res) => {
    const select = req.body.select;
    fs.writeFileSync(path.join(__dirname, 'select.txt'), select);
    res.redirect('admin.html?done=true');
});

app.listen('5000', () => {
    console.log("Server listening on 5000");
});
