'use strict';

const db = require('./DBmanager');
const crypto = require('crypto');
const { User } = require('../utils');


exports.getUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        const sql = 'SELECT * FROM Users WHERE email = ?';
        let row = await db.DBget(sql, [email]);
        if (row === undefined)
            reject({err: 422, msg: "Invalid username"});
        const user = new User(row.id, row.name, row.surname, row.email);
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
            if (err)
                reject(err);
            if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                resolve(false);
            else {
                resolve(user);
            }
        });
    })
};

exports.getUserById = async (id) => {
    try {
        const sql = 'SELECT * FROM Users WHERE id = ?';
        const row = await db.DBget(sql, [id]);
        if (row === undefined)
            resolve({ err: 404, msg: 'User not found!' });
        const user = new User(row.id, row.name, row.surname, row.email);
        return (user);
    } catch (err) {
        throw err;
    }
};