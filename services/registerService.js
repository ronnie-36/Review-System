import DBConnection from "../config/db.js";

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // check email is exist or not
        let existingEmail = await checkExistEmail(data.email);
        if (existingEmail) {
            reject(`This email "${data.email}" already exists. Please choose an other email`);
        } else {
            //create a new account
            DBConnection.query(
                ' INSERT INTO users set ? ', data,
                function (err, rows) {
                    if (err) {
                        reject(false)
                    }
                    resolve("Create a new user successful");
                }
            );
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
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
export default {
    createNewUser: createNewUser
};