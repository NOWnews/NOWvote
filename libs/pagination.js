
/*
 * -------- 傳入的資料 --------
 * options.total 總筆數
 * options.limit 每次撈取幾筆資料
 * options.currnetPage 現在的頁數
 *
 * -------- 回傳的資料 --------
 * pageInfo.currentPage 當前的頁數
 * pageInfo.totalPage 總共的頁數
 * pageInfo.nextPage 是否有下一頁
 * pageInfo.prevPage 是否有上一頁
 * pageInfo.errorMessage 錯誤訊息
 *
 */

import is from 'is_js';

module.exports = function(options) {

    let total = parseInt(options.total, 10);
    let limit = parseInt(options.limit, 10);
    let currnetPage = parseInt(options.currnetPage, 10);
    let errorMessage = false;

    if(is.nan(total) || total <= 0 ){
        total = 0;
        errorMessage = '總數必須是不為 0 數字';
    }

    if(is.nan(limit) || limit <= 0){
        limit = 12;
        errorMessage = '每筆數字必須是不為 0 數字';
    }

    if(is.nan(currnetPage) || currnetPage <= 0){
        currnetPage = 1;
        errorMessage = '當前頁數必須是不為 0 數字';
    }

    // 如果不能整除就 +1
    let totalPage = Math.ceil(total/limit);
    let nextPage = ( currnetPage < totalPage ) ? true : false ;
    let prevPage = ( 1 < currnetPage && currnetPage <= totalPage ) ? true : false;

    return {
        currentPage: currnetPage,
        totalPage: totalPage,
        nextPage: nextPage,
        prevPage: prevPage,
        errorMessage: errorMessage
    };
};