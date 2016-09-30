var request = require('request');
var requestp = require('request-promise');
var cheerio = require('cheerio');


var url = "http://gogoanime.tv/category/";
getTotalEpisodes(url + 'inuyasha');

    function getTotalEpisodes(url){
        var options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        requestp(options).then(function($){
            var episodes = $('#episode_page').children().last().children().html();
            var array = episodes.split('-');
            var end = array[1];
            var episodes = $('#episode_page').children().first().children().html();
            var array = episodes.split('-');
            var start = array[0];
            console.log(end);
            console.log(start);
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