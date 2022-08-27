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

export default {
    getSignedURL: getSignedURL,
};