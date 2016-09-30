var request = require('request');
var requestp = require('request-promise');
var cheerio = require('cheerio');


var url = "http://couchtuner2.to/watch-miss-fishers-murder-mysteries-online/";
request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            //console.log(html);

            $('.panel-collapse').each(function(i,elem){
                var z = $(this).children().children().children().children().children().attr("href");
                var c = z.split(".")[1].split('-');
                var epic = c[c.length-1]
                console.log(epic);
            });

            var a = $('.collapse.in').children().children().children().children().html();
            var b = a.split(".")[1].split('-');
            var episode = b[b.length-1]
            console.log(episode);
            var epiUrl = "http://couchtuner2.to/stream/miss-fishers-murder-mysteries-"+episode+".html";

            // var newurl = $('iframe').attr('src');
            request(epiUrl, function(error, response, html){
                //console.log(html);
                var $ = cheerio.load(html);
                $('.domain').each(function(i,elem){
                    //console.log(elem);
                    var linkVideo = $(this).children().attr('href');
                    var videoLocation = $(this).children().html().split(" ");
                    videoLocation = videoLocation[videoLocation.length-1];
                    if(videoLocation == "allmyvideos.net"){
                        getMoviesAllVideos(linkVideo)
                    }
                })
            });
        }
    })

    function getMoviesAllVideos(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        requestp(options).then(function($){
            var newurl = $('iframe').attr('src');
            options.uri = newurl
            return requestp(options);
        }).then(function($){
            var newurl = $('#player_code').children('script').last().html();
                newurl = newurl.slice(38);
                newurl = newurl.slice(0,-4);
                newurl = newurl.replace("$(window).width()", '"W3Schools"');
                newurl = newurl.replace("$(window).height()", '"W3Schools"');
                newurl = JSON.parse(newurl);
                var file = newurl.playlist[0].sources[1].file;
                console.log(file);
        })
    }