var vlc = require('vlc-node')({username:'example', password:'example'});
var Q = require('q');
 
vlc.status.pause()
.then(vlc.status.play())
.then(vlc.status.fullscreen());