import DBConnection from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

let addMultimedia = (data, type, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let media = {
                mediaID: uuidv4(),
                mediaref: data.name,
                reviewID: id,
                type: type,
                caption: data.caption,
            };
            DBConnection.query(
                ' INSERT INTO multimedia set ? ', media,
                function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    resolve("added");
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let addReview = (review, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newReview = {
                reviewID: uuidv4(),
                text: review.text,
                rating: review.rating,
                time: new Date().toISOString(),
                author: id,
                org: review.org,
            };
            DBConnection.query(
                ' INSERT INTO review set ? ', newReview,
                async function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    for (const image of review.images) {
                        await addMultimedia(image, "image", newReview.reviewID);
                    }
                    for (const video of review.videos) {
                        await addMultimedia(video, "video", newReview.reviewID);
                    }
                    for (const audio of review.audios) {
                        await addMultimedia(audio, "audio", newReview.reviewID);
                    }
                    resolve("added review");
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let getMultimedia = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * from multimedia WHERE reviewID = ? ', id,
                async function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    let multimedia = [...rows];
                    let output = {
                        'images': [],
                        'videos': [],
                        'audios': []
                    };
                    for (let media of multimedia) {
                        let url = process.env.IPFS_URL.concat(media.mediaref);
                        let captionUrl = process.env.IPFS_URL.concat(media.caption);
                        await axios.get(captionUrl)
                            .then((response) => {
                                media.caption = response.data;
                            })
                            .catch((err) => {
                                throw (err);
                            });
                        switch (media.type) {
                            case 'image': {
                                output.images.push({ 'url': url, 'caption': media.caption });
                                break;
                            }
                            case 'audio': {
                                output.audios.push({ 'url': url, 'caption': media.caption });
                                break;
                            }
                            case 'video': {
                                output.videos.push({ 'url': url, 'caption': media.caption });
                                break;
                            }
                            default:
                                break;
                        }
                    }
                    resolve(output);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let getReviews = (id, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};
            let table = "";
            if (type == "user") {
                table = "review JOIN Organization ON review.org = Organization.orgID";
                query = { 'author': id };
            }
            else if (type == "org") {
                table = "review";
                query = { 'org': id };
            }
            let reviews = [];
            DBConnection.query(
                ` SELECT * FROM ${table} WHERE ? `, query,
                async function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    // console.log(rows);
                    reviews = [...rows];
                    let output = [];
                    for (let review of reviews) {
                        let textUrl = process.env.IPFS_URL.concat(review.text);
                        await axios.get(textUrl)
                            .then((response) => {
                                review.text = response.data;
                            })
                            .catch((err) => {
                                throw (err);
                            });
                        let multimedia = await getMultimedia(review.reviewID);
                        output.push({ ...review, ...multimedia });
                    }
                    resolve(output);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

export default {
    addReview: addReview,
    getReviews: getReviews,
};