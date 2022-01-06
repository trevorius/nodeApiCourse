const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');

const {error,success,createId } = require('./app/services/functions');
const membersService = require('./app/services/members');

const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodecourse'
});

db.connect((err) => {
    if (err)
        console.log(err.message);
    else{
        console.log('Connected to database');
        const app = express();

        app.use(morgan('dev'));
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }))
        // parse application/json
        app.use(bodyParser.json())

        let MembersRouter = express.Router();

        MembersRouter.route('/:id')
            // get a member by id
            .get((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?',[req.params.id], (err, rows) => {
                    if (err)
                        res.json(error(err.message));
                    else
                    {
                        if(rows[0] == undefined)
                            res.json(error('invalid id'));
                        else
                            res.json(success(rows[0]));
                    }
                });
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
                    db.query('SELECT * FROM members limit 0, ?',[req.query.max], (err, result) => {
                        if (err)
                            res.json(error(err.message));
                        else
                            res.json(success(result));
                    });
                } else if (req.query.max != undefined){
                    res.json(error("invalid max parameter"))
                }
                else{
                    db.query('SELECT * FROM members', (err, result) => {
                        if (err)
                            res.json(error(err.message));
                        else
                            res.json(success(result));
                    });
                }
            })
            // add a member
            .post((req,res) => {
                if (req.body.name){

                    // check if name already exists
                    db.query('Select * from members where name = ?',[req.body.name], (err, result) => {
                        if (err)
                            res.json(error(err.message));
                        else{
                            if(result.length > 0)
                                res.json(error('Name already exists'));
                            else{
                                db.query('INSERT INTO members (name) VALUES (?)',[req.body.name], (err, result) => {
                                    if (err)
                                        res.json(error(err.message));
                                    else {
                                        db.query('select * from members where name = ?', [req.body.name], (err, result) => {
                                            if (err)
                                                res.json(error(err.message));
                                            else
                                                console.log(result);
                                                res.json(success({
                                                    id: result[0].Id,
                                                    name: result[0].name
                                                }));
                                        });
                                    }
                                });
                            }
                        }
                    });

                    // if (!membersService.nameAllreadyExists(req.body.name,members)){
                    //     let newMember = membersService.createNewMember(req.body.name,members);
                    //     res.json(success(newMember));
                    // }
                    // else res.json(error("name allready exists"));
                }
                else{
                    res.json(error("invalid name parameter"))
                }
            })

        app.use(config.rootApi+'members', MembersRouter);

        app.listen(config.port, () => console.log('Server started on port 3000'));

    }
});
