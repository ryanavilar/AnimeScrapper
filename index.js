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

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('index.ejs');

})

app.get('/anime/:title', function(req, res){

    var urlMaster = "http://gogoanime.tv/category/";
    var urlEpisode = "http://gogoanime.tv/";
    var anime = req.params.title;

    var videos = [];
    getTotalEpisodes(urlMaster + anime);
    
    
    var sortByKeyz = function(array, key) {
        return array.sort(function(a, b) {
            var q = a[key].split("-"); var w = b[key].split("-");
            var x = parseInt(q[q.length-1]); var y = parseInt(w[w.length-1]);
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function getTotalEpisodes(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options).then(function($){
            var episodes = $('#episode_page').children().children().html();
            var array = episodes.split('-');
            var start = array[0];
            var end = array[1];
            //console.log(end);
            var arrayPromise = [];
            if(start == 0) start++;
            for(var i = start; i <= end;i++){
                if(anime == "danganronpa-3-the-end-of-kibougamine-gakuen-mirai-hen" && i == 12){
                    var promise = getAnime(urlEpisode + anime,urlEpisode + anime + "-episode-"+i);
                }else{
                    var promise = getAnime(urlEpisode + anime + "-episode-"+i,urlEpisode + anime + "-episode-"+i);
                }
                arrayPromise.push(promise);
            }
            return Promise.all(arrayPromise).then(function(all){

                videos = sortByKeyz(videos,"name");
                res.render('anime.ejs',{videos : videos, name : anime});
            });
        }).catch(function(err){
            console.log(err);
        })

        
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
            var video = { name : name[name.length-1], file: $('#my-video-player').children().attr('src') };
            videos.push(video);
        }).catch(function(err){
            console.log(err);
        });
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