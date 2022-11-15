const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/index.html');
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});