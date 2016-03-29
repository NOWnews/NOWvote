
/*
 * 傳開始時間跟結束時間，判斷今天是否包含在其中，並回傳 Boolean
 */

import moment from 'moment-timezone';

module.exports = function(startTime, endTime) {

    let isSchedule = false;

    let now = moment().tz('Asia/Taipei').valueOf();
    let start = moment(startTime).valueOf();
    let end = moment(endTime).valueOf();

    if ( now > start && end > now ) {
        isSchedule = true;
    }

    return isSchedule;
};
