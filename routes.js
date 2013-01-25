var async = require('async')
  , _ = require('underscore')
  , moment = require('moment')
  , survey = require('node-foursquare');


module.exports = function routes(app){

  app.get('/api/foursquare.json', function(req, res){
    res.json({'test': true});
  });

  //Nothing specified
  app.all('*', function notFound(req, res) {
    res.send('Not Found');
  });

}

