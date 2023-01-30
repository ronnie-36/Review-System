import DBConnection from "../config/db.js";
import { nanoid } from 'nanoid';
import encryptionService from "./encryptionService.js";
import axios from "axios";
import anchor from "@project-serum/anchor";
import { program, provider } from "../config/solana/main.js";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils/index.js";
import BN from 'bn.js';
const { SystemProgram } = anchor.web3;

let addReview = (review, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newReview = {
                text: review.text,
                rating: review.rating,
                images: review.images,
                videos: review.videos,
                audios: review.audios,
                time: new Date().toISOString(),
            };
            const encrypted_org_id = encryptionService.encrypt(review.org);
            const orgSeeds = [Buffer.from("organization"), Buffer.from(encrypted_org_id)];
            const [orgAccount, _orgBump] = publicKey.findProgramAddressSync(
                orgSeeds,
                program._programId
            );

            let orgData = await program.account.organization.fetch(orgAccount);

            const encrypted_user_id = encryptionService.encrypt(id);
            const userSeeds = [Buffer.from("user"), Buffer.from(encrypted_user_id)];
            const [userAccount, _userBump] = publicKey.findProgramAddressSync(
                userSeeds,
                program._programId
            );

            let userData = await program.account.user.fetch(userAccount);

            const reviewSeeds = [
                Buffer.from("review"),
                orgAccount.toBuffer(),
                orgData.reviewCount.toArrayLike(Buffer),
            ];

            const userReviewSeeds = [
                Buffer.from("user_review"),
                userAccount.toBuffer(),
                userData.reviewCount.toArrayLike(Buffer),
            ];

            const [reviewAccount, _reviewBump] = publicKey.findProgramAddressSync(
                reviewSeeds,
                program._programId
            );

            const [userReviewAccount, _userReviewBump] =
                publicKey.findProgramAddressSync(userReviewSeeds, program._programId);

            await program.rpc.createReview(encrypted_org_id, encrypted_user_id, newReview, {
                accounts: {
                    orgAccount: orgAccount,
                    userAccount: userAccount,
                    reviewAccount: reviewAccount,
                    userReviewAccount: userReviewAccount,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
            });
            resolve("added review");
        } catch (err) {
            reject(err);
        }
    });
};

let prepareReview = (reviewData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let outputReview = {
                rating: reviewData.rating,
                time: reviewData.time,
                images: [],
                videos: [],
                audios: [],
            };
            let textUrl = process.env.IPFS_URL.concat(reviewData.text);
            await axios.get(textUrl)
                .then((response) => {
                    outputReview.text = response.data;
                })
                .catch((err) => {
                    throw (err);
                });
            for (let image of reviewData.images) {
                let url = process.env.IPFS_URL.concat(image.mediaref);
                let captionUrl = process.env.IPFS_URL.concat(image.caption);
                await axios.get(captionUrl)
                    .then((response) => {
                        image.caption = response.data;
                    })
                    .catch((err) => {
                        throw (err);
                    });
                outputReview.images.push({ 'url': url, 'caption': image.caption });
            }
            for (let video of reviewData.videos) {
                let url = process.env.IPFS_URL.concat(video.mediaref);
                let captionUrl = process.env.IPFS_URL.concat(video.caption);
                await axios.get(captionUrl)
                    .then((response) => {
                        video.caption = response.data;
                    })
                    .catch((err) => {
                        throw (err);
                    });
                outputReview.videos.push({ 'url': url, 'caption': video.caption });
            }
            for (let audio of reviewData.audios) {
                let url = process.env.IPFS_URL.concat(audio.mediaref);
                let captionUrl = process.env.IPFS_URL.concat(audio.caption);
                await axios.get(captionUrl)
                    .then((response) => {
                        audio.caption = response.data;
                    })
                    .catch((err) => {
                        throw (err);
                    });
                outputReview.audios.push({ 'url': url, 'caption': audio.caption });
            }
            resolve(outputReview);
        } catch (err) {
            reject(err);
        }
    });
};
let getUserReviews = (userAccount, i) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userReviewSeeds = [
                Buffer.from("user_review"),
                userAccount.toBuffer(),
                new BN(i).toArrayLike(Buffer),
            ];
            const [userReviewAccount, _userReviewBump] =
                publicKey.findProgramAddressSync(userReviewSeeds, program._programId);
            const userReviewData = await program.account.userReview.fetch(
                userReviewAccount
            );
            const reviewData = await program.account.review.fetch(userReviewData.review);
            let outputReview = await prepareReview(reviewData);
            DBConnection.query(
                ' SELECT * FROM `Organization` WHERE `orgID` = ?  ', encryptionService.decrypt(reviewData.organization),
                async function (err, rows) {
                    if (err) {
                        throw (err);
                    }
                    if (rows.length > 0) {
                        resolve({ ...outputReview, ...rows[0] });
                    }
                    else {
                        throw ("Error finding Organization.");
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let getOrgReviews = (orgAccount, i) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reviewSeeds = [
                Buffer.from("review"),
                orgAccount.toBuffer(),
                new BN(i).toArrayLike(Buffer),
            ];
            const [reviewAccount, _reviewBump] = publicKey.findProgramAddressSync(
                reviewSeeds,
                program._programId
            );
            const reviewData = await program.account.review.fetch(reviewAccount);
            let outputReview = await prepareReview(reviewData);
            resolve(outputReview);
        } catch (err) {
            reject(err);
        }
    });
};

let getReviews = (id, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let output = [];
            if (type == "user") {
                const encrypted_user_id = encryptionService.encrypt(id);
                const userSeeds = [Buffer.from("user"), Buffer.from(encrypted_user_id)];
                const [userAccount, _userBump] = publicKey.findProgramAddressSync(
                    userSeeds,
                    program._programId
                );
                let userData = await program.account.user.fetch(userAccount);
                let reviewCount = userData.reviewCount;
                const getOutput = [...Array(reviewCount.toNumber()).keys()].map((iter) => {
                    return getUserReviews(userAccount, iter);
                });
                output = await Promise.all(getOutput);
            }
            else if (type == "org") {
                const encrypted_org_id = encryptionService.encrypt(id);
                const orgSeeds = [Buffer.from("organization"), Buffer.from(encrypted_org_id)];
                const [orgAccount, _orgBump] = publicKey.findProgramAddressSync(
                    orgSeeds,
                    program._programId
                );
                let orgData = await program.account.organization.fetch(orgAccount);
                let reviewCount = orgData.reviewCount;
                const getOutput = [...Array(reviewCount.toNumber()).keys()].map((iter) => {
                    return getOrgReviews(orgAccount, iter);
                });
                output = await Promise.all(getOutput);
            }
            resolve(output);
        } catch (err) {
            reject(err);
        }
    });
};

export default {
    addReview: addReview,
    getReviews: getReviews,
};