
/*
 * source: 檔案位置
 * target: 移動位置
 */

import fs from 'fs-extra';
import fsp from 'fs-promise';
import path from 'path';
import co from 'co';
import Promise from 'bluebird';

Promise.promisifyAll(require('fs'));

module.exports = function(source, target) {

    return co(function*() {

        if(!source) {
            return yield Promise.reject(new Error('source not found'));
        }

        if(!target) {
            return yield Promise.reject(new Error('target not found'));
        }

        yield fsp.move(source, target, { clobber: true });

        let existFile;

        // 這邊確認檔案是否存在
        try {
            existFile = fs.statSync(target);
        }
        catch (e) {
            console.log('File does not exist.');
        }

        let returnFilePath = existFile ? target : undefined;

        return Promise.resolve(returnFilePath);
    })
    .catch(function(err) {
        return Promise.reject(err);
    });
};