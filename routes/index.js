var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotify');
var filters = require('../filters');


var scopes = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public'];
var state = 'spotify-song-miner-random-string';

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res) {
    res.redirect(authorizeURL);
});

router.get('/callback', function (req, res) {
    spotifyApi.authorizationCodeGrant(req.query.code)
        .then(function (data) {
            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);

            res.redirect('/user');
        }, function (err) {
            console.log('Something went wrong!', err);
        });
});

/* GET users playlists. */
router.get('/user', function (req, res, next) {
    var user;
    var playlists;

    // Gets the user
    spotifyApi.getMe()
        .then(function (data) {
            user = data.body;
        }, function (err) {
            console.log('Something went wrong!', err);
        })
        .then(spotifyApi.getCurrentUserPlaylists()
            .then(function(data){
                //console.log(data.body);
                playlists = filters.playlists(data.body);
            })
            .then(function(){
                res.render('user', {user: user, playlists: playlists});
            })
        );

});

router.post('/playlist', function (req, res){
   res.send(req.body.playlistId);
});



module.exports = router;
