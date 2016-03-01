
const moveFile = require('./moveFile');
const checkExt = require('./checkExt');
const hashPwd = require('./hashPwd');

module.exports = {
    hashPwd: hashPwd,
    moveFile: moveFile,
    checkExt: checkExt
};