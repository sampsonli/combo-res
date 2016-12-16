/**
 * Created by lichun on 2016/7/19.
 */
'use strict';

var fs = require('fs'),
    path = require('path');
var cache = {};
module.exports = function(root) {
    return function(req, res, next) {
        if (req.originalUrl.indexOf("??") === -1) {
            next();
            return;
        }

        var comboContent = cache[req.originalUrl]||(cache[req.originalUrl] = getContent(req.originalUrl, root));
        comboContent?res.end(comboContent):next();
    };
};

function getContent(originalUrl,root){
    var comboContent = '';
    root = root || __dirname;
    var files = originalUrl.split("??");
    var publicDir = files[0];

    if (!publicDir || !files[1]) {
        return
    }

    var comboFiles = files[1].split(",");
    if(comboFiles.some(function(t){
            if (t.indexOf("?") > -1) {
                t = t.slice(0, t.indexOf("?"));
            }
            var curFile = path.join(root, publicDir, t);
            if (fs.existsSync(curFile)) {
                comboContent += fs.readFileSync(curFile, "utf8")+"\n";
            }else{
                return true;
            }
        })){
    }else{
        if (comboContent.length) {
            return comboContent;
        }
    }
}