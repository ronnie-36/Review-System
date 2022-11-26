import crypto from 'crypto';

const algorithm = "bf-ecb";

// const initVector = Buffer.from(process.env.ENCRYPTION_IV, "hex");
const Securitykey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

let encrypt = (val) => {
    let cipher = crypto.createCipheriv(algorithm, Securitykey, '');
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

let decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv(algorithm, Securitykey, '');
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
};

export default {
    encrypt: encrypt,
    decrypt: decrypt,
};