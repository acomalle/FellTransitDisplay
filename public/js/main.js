var nearby = [
  {
      name: 'Falletti Foods'
    , url: 'http://www.yelp.com/biz/falletti-foods-san-francisco'
    , hours: {
        all: [7,21]
    }
  },
  {
      name: 'The Page'
    , url: 'http://www.yelp.com/biz/the-page-san-francisco'
    , hours: {
        all: [17,26]
    }
  },
  {
      name: 'Little Star'
    , url: 'http://www.yelp.com/biz/little-star-pizza-san-francisco'
    , hours: {
        1: [17,22]
      , 2: [17,22]
      , 3: [17,22]
      , 4: [17,22]
      , 5: [12,23]
      , 6: [12,23]
      , 0: [12,22]
    }
  },
  {
      name: 'Corner store - New Star-Ell Liquor'
    , url: 'http://www.yelp.com/biz/new-star-ell-liquor-san-francisco'
    , hours: {
      all: [10,26]
    }
  },
  {
      name: 'The Little Chihuahua'
    , url: 'http://www.yelp.com/biz/the-little-chihuahua-san-francisco'
    , hours: {
        1: [11,23]
      , 2: [11,23]
      , 3: [11,23]
      , 4: [11,23]
      , 5: [11,23]
      , 6: [10,23]
      , 0: [10,23]
    }
  },
  {
      name: 'Stelladoro Pizza'
    , url: 'http://www.yelp.com/biz/stelladoro-pizza-restaurant-san-francisco'
    , hours: {
        1: [16,22]
      , 2: [16,22]
      , 3: [16,22]
      , 4: [16,22]
      , 5: [16,22]
      , 6: [16,22]
      , 0: [16,21]
    }
  },
  {
      name: 'Alamo Square Market & Deli'
    , url: 'http://www.yelp.com/biz/alamo-square-market-and-deli-san-francisco-2'
    , hours: {
        1: [8,21]
      , 2: [8,21]
      , 3: [8,21]
      , 4: [8,21]
      , 5: [8,22]
      , 6: [9,22]
      , 0: [9,21]
    }
  },
  {
      name: 'Haight Street Market'
    , url: 'http://www.yelp.com/biz/haight-street-market-san-francisco'
    , hours: {
        all: [7,21]
    }
  },
]

function updateClock() {
  var currentTime = new Date(),
      currentHours = currentTime.getHours(),
      currentMinutes = currentTime.getMinutes(),
      currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
  
  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes;

  // Update the time display
  $('#clock').html(currentTimeString);
}



function getMUNI(){
  //Define Muni Roures
  var MUNIroutes = [
  {
    route: 5,
    stop: 5390
  },
  {
    route: 6,
    stop: 4951
  },
  {
    route: 21,
    stop: 4992
  },
  {
    route: 22,
    stop: 4632
  },
  {
    route: 71,
    stop: 4951
  },
  {
    route: '71L',
    stop: 4951
  },
  {
    route: 'N',
    stop: 7318
  },
  {
    route: 'N OWL',
    stop: 4951
  },
  ];
  
  var url = 'http://webservices.nextbus.com/service/publicXMLFeed';
  
  function getRoute(route, stop){
    //Request Departures
    $.ajax({
      url: url,
      data: {
        command: 'predictions',
        a: 'sf-muni',
        r: route,
        s: stop
      },
      dataType: 'xml',
      success:function(result){
        var divName = 'muni' + route.toString().replace(/\s/g, '') + '_' + stop;
        var div = $('#' + divName);

        if(!div.length) {
          var routeName = route.toString().replace(/OWL/g, '<span>OWL</span>'),
              div = $('<div>')
                .addClass('muni')
                .attr('id', divName)
                .append($('<div>')
                  .addClass('busnumber')
                  .html(routeName))
                .append($('<div>')
                  .addClass('nextbus time'))
                .append($('<div>')
                  .addClass('laterbuses')
                  .append($('<div>')
                    .addClass('time'))
                  .append($('<div>')
                    .addClass('time')))
                .appendTo('#times');
        } else {
          //Clear old times
          $('.time', div).html('');
        }
        
        //Check if route is still running
        div.toggle($(result).find('prediction').length > 0)
        
        var idx = 0;
        $(result).find('prediction').each(function(i, data){
          //Limit to 3 results, only show times less than 100, don't show results that are 0
          if(idx < 3 && $(data).attr('minutes') < 100 && $(data).attr('minutes') > 0){
            $('.time', div).eq(idx).html($(data).attr('minutes'));
            
            idx++;
          }
        });
      }
    });
  }

  //Loop through all routes
  for(var i in MUNIroutes){
    getRoute(MUNIroutes[i].route, MUNIroutes[i].stop);
  }
}

function checkOpen(){
  var currentTime = new Date(),
      currentHours = currentTime.getHours(),
      currentDay = currentTime.getDay();
  nearby.forEach(function(place){
    var divName = place.name.replace(/\s/g, ''),
        div = $('#' + divName),
        hours = place.hours.all || place.hours[currentDay],
        status;

    if(currentHours < 4){
      currentHours += 24;
    }


    if(!div.length) {
      var div = $('<div>')
        .addClass('place')
        .attr('id', 'divName')
        .append($('<div>')
          .addClass('status'))
        .append($('<a>')
          .addClass('storeName')
          .attr('href', place.url)
          .html(place.name))
        .appendTo('#nearby');
    }
    console.log(hours)
    console.log(currentHours)
    if(currentHours < hours[0] || currentHours > hours[1]) {
      status = 'closed';
    } else if(currentHours == (hours[1] - 1) ) {
      status = 'closing';
    } else {
      status = 'open';
    }
    $('.status', div)
      .removeClass('open closed closing')
      .addClass(status);

  });
}


$(document).ready(function(){

  //Update Clock
  setInterval(updateClock, 1000);
  
  //Get MUNI
  getMUNI();
  setInterval(getMUNI, 15000);

  //check open times
  checkOpen();
  setInterval(checkOpen, 60000);
});