var async = require('async')
  , _ = require('underscore')
  , moment = require('moment')
  , survey = require('node-foursquare')
  , request = require('request');


module.exports = function routes(app){

  app.get('/api/foursquare.json', function(req, res){
    /*request.post({
        url: 'https://api.foursquare.com/v2/checkins/recent'
      , method: 'POST'
      , 
    })*/
    res.json({'test': true});
  });

  //Nothing specified
  app.all('*', function notFound(req, res) {
    res.send('Not Found');
  });

}

