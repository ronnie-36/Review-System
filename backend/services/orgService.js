import DBConnection from "../config/db.js";
import axios from "axios";

let addOrg = (place_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            var config = {
                method: 'get',
                url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name%2Cgeometry%2Cformatted_phone_number%2Cformatted_address%2Cwebsite%2Cphotos&key=${process.env.GOOGLE_API_KEY}`,
                headers: {}
            };
            axios(config)
                .then((response) => {
                    let placeDetails = response.data;
                    // console.log(placeDetails);
                    if (placeDetails.status == "OK") {
                        let newOrg = {
                            orgID: place_id,
                            name: placeDetails.result.name,
                            loc_lat: placeDetails.result.geometry.location.lat,
                            loc_long: placeDetails.result.geometry.location.lng,
                            phone: placeDetails.result.formatted_phone_number,
                            address: placeDetails.result.formatted_address,
                            website: placeDetails.result.website,
                        }
                        DBConnection.query(
                            ' INSERT INTO Organization set ? ', newOrg,
                            function (err, rows) {
                                if (err) {
                                    reject(err)
                                }
                                resolve(newOrg);
                            }
                        );
                    }
                    else {
                        reject(false);
                    }
                });
        } catch (err) {
            reject(err);
        }
    });
};

let checkExistOrg = (orgID) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `Organization` WHERE `orgID` = ?  ', orgID,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0) {
                        resolve(rows[0])
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

let getOrg = (place_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let existingOrg = await checkExistOrg(place_id);
            if (existingOrg) {
                resolve(existingOrg);
            } else {
                let newOrg = await addOrg(place_id);
                if (!newOrg) {
                    reject(false);
                }
                else {
                    resolve(newOrg);
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};


export default {
    getOrg: getOrg,
};