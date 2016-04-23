
/*
 * 把整個 file 丟進來，會回傳給你他的副檔名
 */

import co from 'co';
import Promise from 'bluebird';

module.exports = function(file) {

    let extType;

    switch(file.mimetype) {
        case 'image/png':
            extType = 'png';
            break;
        case 'image/jpeg':
            extType = 'jpg';
            break;
    }

    return extType;
};