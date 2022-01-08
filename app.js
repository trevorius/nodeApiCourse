const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
const config = require('./assets/config.json');

const {error,success, checkAndChange} = require('./assets/functions');
const membersService = require('./assets/classes/members');

const mysql = require('promise-mysql');
const db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
}).then((db)=>{

    console.log('Connected to database');
    const app = express();

    app.use(morgan);
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }))
    // parse application/json
    app.use(bodyParser.json())

    let MembersRouter = express.Router();

    const Members = require('./assets/classes/members_class')(db,config);

    MembersRouter.route('/:id')
        // get a member by id
        .get(async(req, res) => {
            let member = await Members.getById(req.params.id);
                res.json(checkAndChange(member));
        })
        // update a member by id
        .put((req, res) => {

            if(req.body.name){
                // find member by id
                db.query('SELECT * FROM members WHERE id = ?',[req.params.id], (err, result) => {
                    if (err)
                        res.json(error(err.message));
                    else
                    {
                        if(result[0] == undefined)
                            res.json(error('invalid id'));
                        else
                        {
                            //check name doesn't already exist
                            db.query('SELECT * from Members where name = ? and id != ?', [req.body.name, req.params.id],(err, result) => {
                                if (err)
                                    res.json(error(err.message))
                                else if (result.length > 0)
                                    res.json(error('name already exists'));
                                else{
                                    // update member
                                    db.query('UPDATE members SET name = ? WHERE id = ?',[req.body.name,req.params.id], (err, rows) => {
                                        if (err)
                                            res.json(error(err.message));
                                        else
                                            db.query('SELECT * FROM members WHERE id = ?',[req.params.id], (err, result) => {
                                                if (err)
                                                    res.json(error(err.message));
                                                else
                                                    res.json(success({"message":'member updated',
                                                        "updatedMember": result[0]}));
                                            });
                                    });
                                }
                            })
                        }
                    }
                });
            }
            else{
                res.json(error('specify new name'))
            }
        })
        // delete a member by id
        .delete((req, res) => {
            // find member by id
            db.query('SELECT * FROM members WHERE id = ?',[req.params.id], (err, result) => {
                if (err)
                    res.json(error(err.message));
                else if (result[0] == undefined)
                    res.json(error('invalid id'));
                else {
                    // delete member
                    db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err, rows) => {
                        if (err)
                            res.json(error(err.message));
                        else
                            res.json(success({"message": 'member deleted'}));
                    });
                }
            })
        });

    MembersRouter.route('/')
        // get all members
        .get(async(req, res) => {
            let members = await Members.getAll(req.query.max);
            res.json(checkAndChange(members));
            // if(req.query.max !=undefined && req.query.max >0){
            //     db.query('SELECT * FROM members limit 0, ?',[req.query.max], (err, result) => {
            //         if (err)
            //             res.json(error(err.message));
            //         else
            //             res.json(success(result));
            //     });
            // } else if (req.query.max != undefined){
            //     res.json(error("invalid max parameter"))
            // }
            // else{
            //     db.query('SELECT * FROM members', (err, result) => {
            //         if (err)
            //             res.json(error(err.message));
            //         else
            //             res.json(success(result));
            //     });
            // }
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
            }
            else{
                res.json(error("invalid name parameter"))
            }
        })

    app.use(config.rootApi+'members', MembersRouter);

    app.listen(config.port, () => console.log('Server started on port 3000'));



}).catch((err)=>{
    console.log("error in connection");
    console.log(err.message)
})

