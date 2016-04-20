
/*
 * 這個是 error object 的 wrapper
 *
 * code: 自定義的錯誤碼 
 * name: 自定義的錯誤名稱 
 * type: 輸出的型態，要 json 或是 web page 
 * errorObject: error 的物件，可以帶入或是由這邊產生
 */

module.exports = function(code, message, type, errorObject) {

    if(!code) {
        code = '10000';
    }

    if(!message) {
        message = '未分類錯誤';
    }

    if(!type) {
        type = 'page'
    }

    if(errorObject) {
        errorObject = new Error(message);
    }

    errorObject.code = code;
    errorObject.message = message;
    errorObject.type = type;

    return errorObject;
};