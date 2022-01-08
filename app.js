const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
const config = require('./assets/config.json');
const swaggerDocument = require('./swagger.json');

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
    expressOasGenerator.init(app, {}); // to overwrite generated specification's values use second argument.

    app.use(morgan);
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }))
    // parse application/json
    app.use(bodyParser.json())

    let MembersRouter = express.Router();

    const Members = require('./assets/classes/members_class')(db,config);
    app.use(config.rootApi + 'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    MembersRouter.route('/:id')
        // get a member by id
        .get(async(req, res) => {
            let member = await Members.getById(req.params.id);
                res.json(checkAndChange(member));
        })
        // update a member by id
        .put(async (req, res) => {
        let member = await Members.update(req.params.id, req.body.name)
            res.json(checkAndChange(member));
        })
        // delete a member by id
        .delete(async (req, res) => {
        let member = await Members.delete(req.params.id);
            res.json(checkAndChange(member));
        });

    MembersRouter.route('/')
        // get all members
        .get(async(req, res) => {
            let members = await Members.getAll(req.query.max);
            res.json(checkAndChange(members));
        })
        // add a member
        .post(async (req,res) => {
        let member = await Members.add(req.body.name);
        res.json(checkAndChange(member));
        })

    app.use(config.rootApi+'members', MembersRouter);

    app.listen(config.port, () => console.log(`Server started on port: ${config.port}`));



}).catch((err)=>{
    console.log(config.errors.ConnectionError);
    console.log(err.message)
})

