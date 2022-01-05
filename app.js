const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use((req, res, next) => {
    console.log("URL: " + req.url);
    next();
})

app.get('/api', (req, res) => {
    res.send(
         'Welcome to the API'
    );
});

app.get('/api/v1/books/:id', (req, res) => {
    res.send(req.params)
});

app.listen(3000, () => console.log('Server started on port 3000'));