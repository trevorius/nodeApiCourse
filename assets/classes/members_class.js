const {error, success} = require("../functions");
let db,config

module.exports = (_db,_config) => {
    db = _db
    config = _config
    return Members
}
// Members

let Members = class {
    static getById(id){
        return new Promise((next) => {
            db.query(`SELECT * FROM members WHERE id = ?`,[id])
                .then(result => {
                    if(result[0] == undefined)
                        next(new Error(config.errors.InvalidId))
                    else
                        next(result[0])
                })
                .catch(err => next(err))
        })
    }

    static getAll(max){
        return new Promise((next) => {
            if(max !=undefined && max >0)
                db.query('SELECT * FROM members limit 0, ?',[parseInt(max)])
                    .then(result => next(result))
                    .catch(err => next(err));
            else if (max != undefined)
                next(new Error(config.errors.InvalidMaxValue))
            else
                db.query('SELECT * FROM members')
                    .then(result => next(result))
                    .catch(err => next(err));
        })
    }

    static add(name){
        return new Promise((next) => {
            if (name && name.trim() != '') {
                name = name.trim()
                // check if name already exists
                db.query('Select * from members where name = ?', [name])
                    .then(result => {
                        if (result.length > 0)
                            next(new Error(config.errors.NameAlreadyExists));
                        else {
                            return db.query('INSERT INTO members (name) VALUES (?)', [name])
                        }
                    })
                    .then(() => {
                        return db.query('select * from members where name = ?', [name])
                    })
                    .then(result => {
                        next(result[0])
                    })
                    .catch((err) => next(err));
            }
            else{
                next(new Error(config.errors.InvalidNameParameter))
            }
        })
    }

    static update(id,name) {
        return new Promise((next) => {
            if (name && name.trim() != '') {
                name = name.trim()
                // find member by id
                db.query('SELECT * FROM members WHERE id = ?',[id])
                .then(result => {
                    if(result[0] == undefined)
                        next(new Error(config.errors.InvalidId));
                    else
                    {
                        //check name doesn't already exist
                        return db.query('SELECT * from Members where name = ? and id != ?', [name, id])
                    }
                })
                .then(result => {
                    if (result.length > 0)
                        next(new Error(config.errors.NameAlreadyExists));
                    else {
                        // update member
                        return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id]);
                    }
                })
                .then(()=>{
                    return db.query('SELECT * FROM members WHERE id = ?',[id])
                })
                .then(result => {
                    next({"message":'member updated',
                        "updatedMember": result[0]})
                })
                .catch(next => next(err.message))
            }
            else{
                next(new Error(config.errors.InvalidNameParameter))
            }
        })
    }

    static delete(id){
        return new Promise ((next) => {
            let deletedMember;
            // find member by id
            db.query('SELECT * FROM members WHERE id = ?',[id])
                .then(result => {
                    if (result[0] == undefined)
                        next(new Error(config.errors.InvalidId));
                    else
                        deletedMember = result[0];
                        // delete member
                        return db.query('DELETE FROM members WHERE id = ?', [id])
                })
                .then(()=>{
                    next({"message":'member deleted',
                        "deletedMember": deletedMember})
                })
                .catch(next => next(err.message))

        })

        
    }
}