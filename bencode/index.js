/**
 * Created by apple on 16/1/25.
 */

'use strict';

var bencode = require('./bencode');
var fs = require('fs');

let fd = fs.openSync('./1.torrent', 'r');
let bt = bencode.readSomething(fd, new Buffer(1024*1024));
console.log(JSON.stringify(bt));