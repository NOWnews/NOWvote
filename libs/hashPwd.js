
import crypto from 'crypto';

const constString = '$nownews@vote.';

module.exports = function(password) {

    let hashString = constString + password;

    return crypto.createHash('md5').update(hashString).digest('hex');
};