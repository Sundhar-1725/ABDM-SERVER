const forge = require('node-forge')

const callEncryption = async (content, publicKeyBase64) => {
    try {

        const pem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`;
        const publicKey = forge.pki.publicKeyFromPem(pem);
        const encrypted = publicKey.encrypt(content, "RSA-OAEP", {
            md: forge.md.sha1.create(),
            mgf1: {
                md: forge.md.sha1.create(),
            },
        });

        return forge.util.encode64(encrypted);
    } catch(error) {
        console.error("Encryption error:", error);
        return null;
    }
}
module.exports = callEncryption