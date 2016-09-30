var express = require('express');
var fs = require('fs');
var request = require('request-promise');
var cheerio = require('cheerio');
var app     = express();

var bodyParser = require('body-parser')


app.set('port', (process.env.PORT || 5000));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('index.ejs');

})


    var urlMaster = "http://gogoanime.tv/category/";
    var urlEpisode = "http://gogoanime.tv/";

app.get('/anime/:title', function(req, res){

    var anime = req.params.title;

    var videos = [];
    var episode;
    getStartEnd(urlMaster + anime).then(function(e){
        episode = e;
        return getAnime(urlEpisode + anime+"-episode-"+1,urlEpisode + anime + "-episode-"+1);
    }).then(function(video){
        res.render('anime.ejs',{episodes : episode, video : video,name : anime});
    }).catch(function(err){
        console.log(err);
    });
    

    function getStartEnd(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return request(options).then(function($){
            var episodes = $('#episode_page').children().last().children().html();
            var array = episodes.split('-');
            var end = array[1];
            var episodes = $('#episode_page').children().first().children().html();
            var array = episodes.split('-');
            var start = array[0];
            if(start == 0) start++;
            var total = []
            for(var i = start; i <= end; i++){
                total.push(anime+"-"+i);
            }
            return total;
        });

    }

    function getAnime(url,name){
        console.log("proses : " + url);
        console.log(name);
        var name = name.split("/");
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
            //var video = { name : name[name.length-1], file: $('#my-video-player').children().attr('src') };
            return $('#my-video-player').children().attr('src');
        }).catch(function(err){
            console.log(err);
        });
    }  


});

app.post('/getAnime',function(req,res){

    var episode = req.body.episode;
    var anime = req.body.anime;
    var epiUrl = urlEpisode + anime+"-episode-"+episode;
    getAnime(epiUrl,epiUrl).then(function(video){
        res.send(video);
    })

    function getAnime(url,name){
        console.log("proses : " + url);
        console.log(name);
        var name = name.split("/");
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
            //var video = { name : name[name.length-1], file: $('#my-video-player').children().attr('src') };
            return $('#my-video-player').children().attr('src');
        }).catch(function(err){
            console.log(err);
        });
    }

})

app.get('/movies',function(req,res){
    getEpisodes("http://couchtuner2.to/watch-miss-fishers-murder-mysteries-online/").then(function(e){
        //console.log(e);
        res.render('movies.ejs',{episodes : e, video : 'empty',name : 'miss-fishers-murder-mysteries'});
    });

    function getEpisodes(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        return request(options).then(function($){
            var episodes = []
            $('.panel-collapse').each(function(i,elem){
                var z = $(this).children().children().children().children().children().attr("href");
                var c = z.split(".")[1].split('-');
                var epic = c[c.length-1].split('e');
                for(var i = 1; i <= epic[epic.length-1];i++){
                    var epipush = epic[0]+'e'+i;
                    episodes.push(epipush);
                }
            });
            return episodes;
        })
    }
})

app.post('/getMovies',function(req,res){
    var episode = req.body.episode;
    var movie = req.body.movie;
    var epiUrl = "http://couchtuner2.to/stream/"+movie+"-"+episode+".html";
    console.log(epiUrl);
    var options = {
            uri: epiUrl,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        request(options).then(function($){
            $('.domain').each(function(i,elem){
                //console.log(elem);
                var linkVideo = $(this).children().attr('href');
                var videoLocation = $(this).children().html().split(" ");
                videoLocation = videoLocation[videoLocation.length-1];
                if(videoLocation == "allmyvideos.net"){
                    console.log(linkVideo);
                    getMoviesAllVideos(linkVideo)
                }
            })
        });

    //vshare
    function getMoviesVshare(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        request(options).then(function($){
            var newurl = $('iframe').attr('src');
            options.url = newurl
            return request(options);
        }).then(function($){
            var newurl = $('#player_code').children('script').last().html();
            var array = newurl.split('\n');
            var file = array[1].split("file: ")[1].split(",")[0];

        })
    }

    // AllVideos
    function getMoviesAllVideos(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
        request(options).then(function($){
            var newurl = $('iframe').attr('src');
            options.uri = newurl
            //console.log(newurl);
            return request(options);
        }).then(function($){
                var newurl = $('#player_code').children('script').last().html();
              //  console.log(newurl);
                newurl = newurl.slice(38);
                newurl = newurl.slice(0,-4);
                newurl = newurl.replace("$(window).width()", '"W3Schools"');
                newurl = newurl.replace("$(window).height()", '"W3Schools"');
                newurl = JSON.parse(newurl);
                var file = newurl.playlist[0].sources[1].file;
                res.send(file);
        }).catch(function(error){
            console.log(error);
        })
    }
});

app.post('/search',function(req,res){
    var search = req.body.q;
    var url = "http://gogoanime.tv//search.html?keyword="+search;
    var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
    request(options).then(function($){
        var result = [];
        var searchResult = $('.anime_movies_items').each(function(i,elem){
            var splitted = $(this).children().attr('href').split('/');
            var oneResult = {name : $(this).children().attr('title'), location : splitted[splitted.length-1]}
            result.push(oneResult);
        });
        res.send(result);
    });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



exports = module.exports = app;