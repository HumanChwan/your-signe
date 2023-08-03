const express = require("express");
const path = require('path');
const fs = require('fs');
const fetch = require("node-fetch")
const app = express();

const { authorize } = require('./google-api')
const { google } = require('googleapis');


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static('public'));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

URL = "https://jsonblob.com/api/jsonBlob/1136760021622579200"
app.get('/select', async (_, res) => {
    try {
        const response = await fetch(URL);
        const data = await response.json();

        res.send(data.mode)
    } catch (e) {
        console.log("HUHUHUHUHU", e)
        return res.send('normal');
    }
});

const appendToSheet = async (values) => {
    values = [values]
    const resource = { values }
    const spreadsheetId = '1tpcDD7k9RzkiWGYeyTJ00oV58Fpcqn0c-vwiRed2gwE'
    const sheetName = 'Sheet1'

    try {
        const auth = await authorize()
        const service = google.sheets({ version: 'v4', auth })

        const result = await service.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!2:3`,
            insertDataOption: 'INSERT_ROWS',
            valueInputOption: 'RAW',
            resource
        })
    } catch (e) {
        console.log(e)
    }
}

app.post('/submit-details', async (req, res) => {
    const { body: { cost, quantity, startTime, endTime, type }} = req
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    try {
        await appendToSheet([ipAddress, startTime.toString(), endTime.toString(), quantity, cost, type])
        res.status(200).json({ success: true })
    } catch (_) {
        res.status(500).json({ success: false })
    }
})

app.post('/admin', async (req, res) => {
    const select = req.body.select;
    try {
        await fetch(URL, {
            method: "PUT",
            body: JSON.stringify({"mode": select}),
            headers: {
                "content-type": "application/json"
            }
        })
        
        return res.redirect('admin.html?done=true');
    } catch (_) {
        return res.redirect('admin.html?done=false');
    }
});

module.exports = app;

