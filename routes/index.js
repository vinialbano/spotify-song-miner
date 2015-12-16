var express = require('express');
var router = express.Router();
var spotifyApi = require('../spotify');
var filters = require('../filters');
var Sync = require('sync');

var scopes = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'user-read-private'];
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

    Sync(function () {
        var granted = (grantAccessToken.sync(null, req.query.code) == "Success");
        if (granted) {
            res.redirect('/user');
        } else {
            console.log("Error");
        }
    });
});

/* GET users playlists. */
router.get('/user', function (req, res, next) {

    Sync(function () {
        var user = getUser.sync(null);
        var playlists = getUsersPlaylists.sync(null);

        res.render('user', {user: user, playlists: playlists});
    });
});

router.post('/playlist', function (req, res, next) {
    var playlistTracks;
    var artistsIds;
    var topTracks;

    Sync(function () {
        playlistTracks = getPlaylistTracks.sync(null, req.body.user_id, req.body.playlist_id);
        artistsIds = filters.playlistArtistsIds(playlistTracks);
        playlistTracks = filters.playlistTracks(playlistTracks);
        console.log(playlistTracks.length);
        topTracks = [];
        artistsIds.forEach(function (id) {
            topTracks = topTracks.concat(getArtistTopTracks.sync(null, id, req.body.user_country));
        });
        console.log(topTracks.length);
        res.send(topTracks);
    });
});

var getPlaylistTracks = function (userId, playlistId, callback) {
    spotifyApi.getPlaylist(userId, playlistId)
        .then(function (data) {
            var playlistTracks = filters.playlistTracksWithArtists(data.body.tracks);
            callback(null, playlistTracks);
        }, function (err) {
            callback(err);
        });
};

var getArtistTopTracks = function (artistId, userCountry, callback) {
    spotifyApi.getArtistTopTracks(artistId, userCountry)
        .then(function (data) {
            callback(null, filters.topTracks(data.body));
        }, function (err) {
            callback(err);
        });
};

var getUser = function (callback) {
    spotifyApi.getMe()
        .then(function (data) {
            callback(null, data.body);
        }, function (err) {
            callback(err);
        });
};

var getUsersPlaylists = function (callback) {
    spotifyApi.getCurrentUserPlaylists()
        .then(function (data) {
            callback(null, filters.playlists(data.body));
        }, function (err) {
            callback(err);
        });
};

var grantAccessToken = function (code, callback) {
    spotifyApi.authorizationCodeGrant(code)
        .then(function (data) {
            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);

            callback(null, "Success");
        }, function (err) {
            callback(err);
        });
};


module.exports = router;
