import client from "../config/twilio.js";

let sendOTP = (phone) => {
    return new Promise((resolve, reject) => {
        try {
            client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE)
                .verifications
                .create({ to: phone, channel: 'whatsapp' })
                .then(verification => resolve(verification));
        } catch (err) {
            reject(err);
        }
    });
}

let verifyOTP = (phone, OTP) => {
    return new Promise((resolve, reject) => {
        try {
            client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE)
                .verificationChecks
                .create({ to: phone, code: OTP })
                .then(verification_check => resolve(verification_check));
        } catch (err) {
            reject(err);
        }
    });
}

export default {
    sendOTP: sendOTP,
    verifyOTP: verifyOTP,
};