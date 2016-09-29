var request = require('request');
var cheerio = require('cheerio');
var vlc = require('vlc')([
  '-I', 'dummy',
  '-V', 'dummy',
  '--verbose', '1',
  '--no-video-title-show',
  '--no-disable-screensaver',
  '--no-snapshot-preview',
  ]);

var url = "http://gogoanime.tv/digimon-adventure-tri-2-ketsui-episode-3";
request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            var newurl = $('.play-video').children().attr('src');
            console.log(newurl);    
            
            
        }
    })
