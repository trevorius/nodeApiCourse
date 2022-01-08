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
                        next(new Error('Member not found'))
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
                next(new Error("invalid max parameter"))
            else
                db.query('SELECT * FROM members')
                    .then(result => next(result))
                    .catch(err => next(err));
        })
    }

}