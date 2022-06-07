'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('./Database/studyplan.db', (err) => { if (err) throw err; });


/** 
 * Execute query for retrieving data (SELECT ...) 
 * @return only the first row of the result
*/
exports.DBget = (query, params) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            })
        });
    } catch (err) {
        throw err;
    }
}

/** 
 * Execute query for retrieving data (SELECT ...) 
 * @return all the rows as a list
*/
exports.DBgetAll = (query, params) => {
    try {
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err)
                    reject(err);
                else {
                    resolve(rows);
                }
            })
        });
    } catch (err) {
        throw err;
    }
}

/** 
 * Execute query for INSERT, DELETE or UPDATE data
 * @return an object with key "changes" as the number of changes in the DB and
 * key "lastID" as the last ID of the inserted row or deleted row
*/
exports.DBexecuteQuery = (query, params) => {
    try {
        return new Promise((resolve, reject) => {
            db.run(query, params, function (err) {
                if (err)
                    reject(err);
                else
                    resolve({ changes: this.changes, lastID: this.lastID });
            });
        });
    } catch (err) {
        throw (err);
    }
}

