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
        // db.query('insert into members(name) values("toto")', (err, result) => {
        //     if (err)
        //         console.log(err.message);
        //     else
        //         console.log(result);
        // });
        db.query('SELECT * From members', (err, result) => {
            if (err)
                console.log(err.message);
            else{
                console.log(result);
                console.log(result[0].name);
            }
        })
    }
});

