var express = require('express');
var fs = require('fs');
var request = require('request-promise');
var cheerio = require('cheerio');
var app     = express();

app.set('view engine', 'ejs');

app.get('/scrape', function(req, res){

    var arrayPromise = [];
    var videos = [];
    var promise = getAnime("http://gogoanime.tv/digimon-adventure-tri-2-ketsui-episode-"+ 1);
    arrayPromise.push(promise);
    for(var i = 2; i < 5;i ++){
        promise = promise.delay(300).then(getAnime("http://gogoanime.tv/digimon-adventure-tri-2-ketsui-episode-"+ i));
        arrayPromise.push(promise);
    }

    Promise.all(arrayPromise).then(function(all){
        //console.log(videos);
        videos = sortByKeyz(videos,"name");
        res.render("index.ejs", {videos : videos});
    })
    
    var sortByKeyz = function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function getAnime(url){
        console.log("proses : " + url);
        var name = url.split("/");
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return request(options)
        .then(function($){
            options.uri = $('.play-video').children().attr('src');
            return request(options)
        }).then(function($){
            var video = { name : name[name.length-1], file: $('#my-video-player').children().attr('src') };
            videos.push(video);
        }).catch(function(err){
            console.log(err);
        });
    }  


})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;