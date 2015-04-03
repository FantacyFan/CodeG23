var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var path = require('path');
var homepage_mp4, homepage_webm, homepage_ogg;

fs.readFile(path.resolve(__dirname,"../public/videos/homepage.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    homepage_webm = data;
});

fs.readFile(path.resolve(__dirname,"../public/videos/homepage.ogg"), function (err, data) {
    if (err) {
        throw err;
    }
    homepage_mp4 = data;
});

fs.readFile(path.resolve(__dirname,"../public/videos/homepage.webm"), function (err, data) {
    if (err) {
        throw err;
    }
    homepage_ogg = data;
});


/* GET users listing. */
router.get('/:videoname', function(req, res, next) {
	var videoname = req.params.videoname;
	var total;
    if(videoname == "homepage.mp4"){
        total = homepage_mp4.length;
    } else if(videoname == "homepage.ogg"){
        total = homepage_ogg.length;
    } else if(videoname == "homepage.webm"){
        total = homepage_webm.length;
    } 
    console.log(total);
    var range = req.headers.range;

    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    // if last byte position is not present then it is the last byte of the video file.
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end-start)+1;

    if(videoname == "homepage.mp4"){
        res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                             "Accept-Ranges": "bytes",
                             "Content-Length": chunksize,
                             "Content-Type":"video/mp4"});
        res.end(homepage_mp4.slice(start, end+1), "binary");

    } else if(videoname == "homepage.ogg"){
        res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                             "Accept-Ranges": "bytes",
                             "Content-Length": chunksize,
                             "Content-Type":"video/ogg"});
        res.end(homepage_ogg.slice(start, end+1), "binary");

    } else if(videoname == "homepage.webm"){
        res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                             "Accept-Ranges": "bytes",
                             "Content-Length": chunksize,
                             "Content-Type":"video/webm"});
        res.end(homepage_webm.slice(start, end+1), "binary");
    }
});

module.exports = router;