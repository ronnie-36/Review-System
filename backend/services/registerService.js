import DBConnection from "../config/db.js";

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist or not
            let existingEmail = await checkExistEmail(data.email);
            if (existingEmail) {
                throw (`This email "${data.email}" already exists. Please choose an other email`);
            }
            else {
                //create a new account
                DBConnection.query(
                    ' INSERT INTO users set ? ', data,
                    function (err, rows) {
                        if (err) {
                            throw (err);
                        }
                        resolve(data);
                    }
                );
            }
        } catch (err) {
            reject(err);
        }
    });
};

let update = (data, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            DBConnection.query(
                ' UPDATE users SET ? WHERE `id` = ?', [data, id],
                function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    resolve("Update successful");
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            DBConnection.query(
                ' DELETE from users WHERE `id` = ?', id,
                function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    resolve("Delete successful");
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ?  ', email,
                function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    if (rows.length > 0) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let checkExistPhone = (phone) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `phone` = ?  ', phone,
                function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    if (rows.length > 0) {
                        let user = rows[0];
                        resolve(user);
                    }
                    else {
                        resolve(false);
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

export default {
    createNewUser: createNewUser,
    update: update,
    deleteUser: deleteUser,
    checkExistPhone: checkExistPhone,
};