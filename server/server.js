require('./config/config.js');

const express = require('express');
const app = express();

const bodyParse = require('body-parser');

// parse application/<-www-form-urlencoded
app.use(bodyParse.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParse.json());


app.get('/usuario', (req, res) => {
    res.json('GET Usuario')
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    res.json({
        persona: body
    });
});

app.put('/usuario', (req, res) => {
    res.json('PUT Usuario')
});

app.delete('/usuario', (req, res) => {
    res.json('DELETE Usuario')
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});