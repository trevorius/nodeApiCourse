const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');

const {error,success,createId } = require('./app/services/functions');
const membersService = require('./app/services/members');

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

let MembersRouter = express.Router();

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

MembersRouter.route('/:id')
    // get a member by id
    .get((req, res) => {
        const index = membersService.getIndex(req.params.id, members);
        if (typeof(index) === 'string' )
            res.json(error(index));
        res.json(success(members[index]));
    })
    // update a member by id
    .put((req, res) => {
        const index = membersService.getIndex(req.params.id, members);
        if (typeof(index) === 'string' )
            res.json(error(index));
        else{
            let member = members[index];
            let nameAlreadyExists = membersService.nameAllreadyExists(req.body.name, members,req.params.id)
            if(nameAlreadyExists)
                res.json(error('Name already exists'));
            else {
                members[index].name = req.body.name;
                res.json(success(true));
            }
        }
    })
    // delete a member by id
    .delete((req, res) => {
        const index = membersService.getIndex(req.params.id, members);
        if (typeof(index) === 'string' )
            res.json(error(index));
        else {
            members.splice(index, 1);
            res.json(success(members));
        }
    });

MembersRouter.route('/')
    // get all members
    .get((req, res) => {
        if(req.query.max !=undefined && req.query.max >0){
            res.json(success(members.slice(0, req.query.max)));
        } else if (req.query.max != undefined){
            res.json(error("invalid max parameter"))
        }
        else res.json(success(members));
    })
    // add a member
    .post((req,res) => {
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

app.use(config.rootApi+'members', MembersRouter);

app.listen(config.port, () => console.log('Server started on port 3000'));
