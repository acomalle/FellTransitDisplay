var async = require('async')
  , _ = require('underscore')
  , moment = require('moment')
  , request = require('request');


module.exports = function routes(app){

  app.get('/api/foursquare.json', function(req, res){
    request.get({
        url: 'https://api.foursquare.com/v2/checkins/recent'
      , qs: {
            oauth_token: app.set('foursquareToken')
          , v: '20130125'
          , ll: '37.77415,-122.43635'
        }
      , json: true
    }, function(e, response, body) {
      res.json(body);
    });
  });

  app.get('/api/instagram.json', function(req, res){
    var users = [403770, 8625420, 728636],
        pictures = [];
    async.forEach(users, function(user, cb){
      request.get({
          url: 'https://api.instagram.com/v1/users/' + user + '/media/recent/'
        , qs: {
              access_token: app.set('instagramToken')
          }
        , json: true
      }, function(e, response, body) {
        pictures = _.union(pictures, body.data);
        cb();
      });
    }, function(e) {
      res.json(_.shuffle(pictures));
    });

  });

  //Nothing specified
  app.all('*', function notFound(req, res) {
    res.send('Not Found');
  });

}

