'use strict';

var filters = {

    // Playlists
    playlists: function (data) {
        return data.items.map(function (obj) {
            return {
                id: obj.id,
                name: obj.name
            };
        });
    },

// Playlist Tracks
    playlistTracksWithArtists: function (data) {
        return data.items.map(function (obj) {
            obj = obj.track;
            return {
                id: obj.id,
                name: obj.name,
                duration: obj.duration_ms,
                explicit: obj.explicit,
                popularity: obj.popularity,
                artists: obj.artists.map(function (artist) {
                    return artist.id;
                })
            };
        });
    },

    playlistTracks: function (data) {
        return data.map(function (obj) {
            return {
                id: obj.id,
                name: obj.name,
                duration: obj.duration_ms,
                explicit: obj.explicit,
                popularity: obj.popularity
            };
        });
    },

    // Playlist Artists IDs
    playlistArtistsIds: function (data) {
        var array = data.map(function (obj) {
                return obj.artists;
            })
            .reduce(function (a, b) {
                return a.concat(b);
            }, []);
        array = array.filter(function (a, i) {
            return array.indexOf(a) === i;
        });
        return array;
    },

// List of artists
    artists: function (data) {
        return data.artists.map(function (obj) {
            return {
                id: obj.id,
                name: obj.name,
                popularity: obj.popularity,
                followers: obj.followers.total,
                genres: obj.genres
            };
        });
    },

// List of albums
    albums: function (data) {
        return data.albums.map(function (obj) {
            return {
                id: obj.id,
                name: obj.name,
                popularity: obj.popularity,
                release_date: obj.release_date,
                genres: obj.genres
            };
        });
    },

// Artist top tracks
    topTracks: function (data) {
        return data.tracks.map(function (obj) {
            return {
                id: obj.id,
                name: obj.name,
                duration: obj.duration_ms,
                explicit: obj.explicit,
                popularity: obj.popularity
            };
        });
    }
};

module.exports = filters;