
/*
 * 傳時間格式，回傳 format 後的格式
 */

import moment from 'moment-timezone';

module.exports = function(dateTime) {

    let formatDate = moment(dateTime).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm');

    return formatDate;
};
