var request = require('request');
var cheerio = require('cheerio');


var url = "http://gogoanime.tv//search.html?keyword=dangan";
request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            //console.log(html);
            var newurl = $('.anime_movies_items').each(function(i,elem){
                console.log($(this).children().attr('title'));
                console.log($(this).children().attr('href'));
            });
        }
    })
