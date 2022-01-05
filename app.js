const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {error,success } = require('./app/services/functions');
const membersService = require('./app/services/members');

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

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
    const index = membersService.getIndex(req.params.id, members);
    if (typeof(index) === 'string' )
        res.json(error(index));
    res.json(success(members[index]));
});

app.get('/api/v1/members', (req, res) => {

    if(req.query.max !=undefined && req.query.max >0){
        res.json(success(members.slice(0, req.query.max)));
    } else if (req.query.max != undefined){
        res.json(error("invalid max parameter"))
    }
    else res.json(success(members));
});
app.post('/api/v1/members', (req,res) => {


    if (req.body.name){
        if (!membersService.nameAllreadyExists(req.body.name,members)){

        let newMember = membersService.createNewMember(req.body.name,members);

        res.json(success(newMember));
        }
        else res.json(error("name allready exists"));
    }
    else{
        res.json(error("invalid name parameter"))

    }
})




app.listen(3000, () => console.log('Server started on port 3000'));
