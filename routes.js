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

  //Nothing specified
  app.all('*', function notFound(req, res) {
    res.send('Not Found');
  });

}

