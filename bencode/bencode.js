/**
 * Created by apple on 16/1/25.
 */

'use strict';

var fs = require('fs');

function readSomething(fd, buf) {
    fs.readSync(fd, buf, 0, 1, null);
    let data = buf.toString('utf8', 0, 1);
    if (data === 'd') { // Dictionary
        let dic = {};
        while (1) { // 循环解析kv
            let key = readStr(fd, buf);
            if (key === null) {
                break;
            }
            let value = readSomething(fd, buf);
            dic[key] = value;
        }
        return dic;
    } else if (data === 'i') { // Number
        let num = readNum(fd, buf);
        return num;
    } else if (data === 'l') { // Array
        let arr = [];
        while (1) { // 循环解析kv
            let value = readSomething(fd, buf);
            if (value === null) {
                break;
            }
            arr.push(value);
        }
        return arr;
    } else if (data === 'e') { // 结束
        return null;
    } else { // String
        let str = readStr(fd, buf, data);
        //return new Buffer(str); // 把某一些字符串以buffer存储, 以免乱码
        return str; // 后面会有些乱码,因为bt中的某一些数据是ASCII码.
    }
}

function readNum(fd, buf) {
    let nstr = [];
    while (1) { // 循环读取
        fs.readSync(fd, buf, 0, 1);
        let bs = buf.toString('utf-8', 0, 1);
        if (bs === 'e') {
            break;
        } else {
            nstr.push(bs);
        }
    }
    let num = new Number(nstr.join(''));
    return num.valueOf();
}

function readStr(fd, buf, some) {
    let nstr = [];
    if (some) {
        nstr.push(some);
    }
    while (1) { // 循环读取
        fs.readSync(fd, buf, 0, 1);
        let bs = buf.toString('utf-8', 0, 1);
        if (bs === ':') {
            break;
        } else if (bs === 'e') {
            return null;
        } else {
            nstr.push(bs);
        }
    }

    let strl = new Number(nstr.join(''));
    fs.readSync(fd, buf, 0, strl);
    let key = buf.toString('utf-8', 0, strl);

    return key;
}

module.exports = {readSomething};