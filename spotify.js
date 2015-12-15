var SpotifyWebApi = require('spotify-web-api-node');
var WebApiRequest = require('spotify-web-api-node/src/webapi-request');
var HttpManager = require('spotify-web-api-node/src/http-manager');
var PromiseImpl = require('spotify-web-api-node/node_modules/promise');


var spotifyApi = new SpotifyWebApi({
    clientId: '9f26fbbb04a640a79d36523adf73ce64',
    clientSecret: '4b55f6d5fabc4d8486ab157f31505c4d',
    redirectUri: 'http://localhost:3000/callback'
});

/**
 * Get a user's playlists.
 * @param {string} userId The user ID.
 * @param {Object} [options] The options supplied to this request.
 * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
 * @example getUserPlaylists('thelinmichael').then(...)
 * @returns {Promise|undefined} A promise that if successful, resolves to an object containing
 *          the a list of playlists. If rejected, it contains an error object. Not returned if a callback is given.
 */

spotifyApi = (function () {
    this.getCurrentUserPlaylists = function (options, callback) {
        var request = WebApiRequest.builder()
            .withPath('/v1/me/playlists')
            .build();

        _addAccessToken(request, this.getAccessToken());
        _addQueryParameters(request, options);

        var promise = _performRequest(HttpManager.get, request);

        if (callback) {
            promise.then(function (data) {
                callback(null, data);
            }, function (err) {
                callback(err);
            });
        } else {
            return promise;
        }
    };
    return this;
}).apply(spotifyApi);

function _addQueryParameters(request, options) {
    if (!options) {
        return;
    }
    for (var key in options) {
        if (key !== 'credentials') {
            request.addQueryParameter(key, options[key]);
        }
    }
}

function _performRequest(method, request) {
    var promiseFunction = function (resolve, reject) {
        method(request, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    };
    return new PromiseImpl(promiseFunction);
}

function _addAccessToken(request, accessToken) {
    if (accessToken) {
        request.addHeaders({
            'Authorization': 'Bearer ' + accessToken
        });
    }
}

module.exports = spotifyApi;