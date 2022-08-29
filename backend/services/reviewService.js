import DBConnection from "../config/db.js";
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

aws.config.update({
    signatureVersion: 'v4',
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

let getSignedURL = (filetype) => {
    return new Promise(async (resolve, reject) => {
        var s3 = new aws.S3();
        let filename = uuidv4();

        var params = {
            Bucket: 'reviewsystemmultimedia',
            Key: filename,
            Expires: 60,
            ContentType: filetype
        };

        s3.getSignedUrl('putObject', params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve({ filename, 'url': data });
            }
        });
    });
};

let addMultimedia = (data, type, id) => {
    return new Promise(async (resolve, reject) => {
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
                    reject(err)
                }
                resolve("added");
            }
        );
    });
};

let addReview = (review, id) => {
    return new Promise(async (resolve, reject) => {
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
            function (err, rows) {
                if (err) {
                    reject(err)
                }
            }
        );
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
    });
};

let getMultimedia = (id) => {
    return new Promise(async (resolve, reject) => {
        DBConnection.query(
            ' SELECT * from multimedia WHERE reviewID = ? ', id,
            async function (err, rows) {
                if (err) {
                    reject(err)
                }
                let multimedia = [...rows];
                let output = {
                    'images': [],
                    'videos': [],
                    'audios': []
                };
                multimedia.forEach((media) => {
                    let url = process.env.AWS_S3_URL.concat(media.mediaref);
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
                });
                resolve(output);
            }
        );
    });
};

let getReviews = (id, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};
            if (type == "user") {
                query = { 'author': id };
            }
            else if (type == "org") {
                query = { 'org': id };
            }
            let reviews = [];
            DBConnection.query(
                ' SELECT * FROM review WHERE ? ', query,
                async function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    // console.log(rows);
                    reviews = [...rows];
                    let output = [];
                    for (let review of reviews) {
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
    getSignedURL: getSignedURL,
    addReview: addReview,
    getReviews: getReviews,
};