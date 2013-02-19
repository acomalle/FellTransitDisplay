var async = require('async')
  , _ = require('underscore')
  , moment = require('moment')
  , request = require('request');


module.exports = function routes(app){

  app.get('/api/baseball.json', function(req, res){
    var now=new Date();
    var month=now.getMonth()+1;
    var year=now.getFullYear();
    request.get({
        url: 'http://sanfrancisco.giants.mlb.com/gen/schedule/sf/'+year+'_'+month+'.json'
      , qs: {
        }
      , json: true
    }, function(e, response, body) {
      res.json(body);
    });
  });

  app.get('/api/instagram.json', function(req, res){
    var users = [403770, 8625420, 728636,50651611,263428,30921174,423595,32411825,201765534,146041273,677080,30926690],
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

