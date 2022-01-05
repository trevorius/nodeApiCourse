const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));

const members = [
    {
        id: 1,
        name: 'John Doe',
    },
    {
        id: 2,
        name: 'Jane Doe',
    },
    {
        id: 3,
        name: 'Jack Doe',
    },
];

app.get('/api/v1/members/:id', (req, res) => {
    res.json(success(members[(req.params.id - 1)]));
});

app.get('/api/v1/members', (req, res) => {

    if(req.query.max !=undefined && req.query.max >0){
        res.json(success(members.slice(0, req.query.max)));
    } else if (req.query.max != undefined){
        res.json(error("invalid max parameter"))
    }
    else res.json(success(members));
});





app.listen(3000, () => console.log('Server started on port 3000'));

function success(result){
    return {
        status: 'success',
        result: result
    }
}
function error(message){
    return {
        status: 'error',
        message: message
    }
}