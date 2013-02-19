var nearby = [
  {
      name: 'Cha Cha Cha'
    , url: 'http://www.yelp.com/biz/cha-cha-cha-san-francisco-4'
    , hours: {
        all: [11.5,23]
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
      name: 'Citrus Club'
    , url: 'http://www.yelp.com/biz/the-citrus-club-san-francisco'
    , hours: {
        1: [11.5,22]
      , 2: [11.5,22]
      , 3: [11.5,22]
      , 4: [11.5,22]
      , 5: [11.5,23]
      , 6: [11.5,23]
      , 0: [11.5,22]
    }
  },
  {
      name: 'Blue Front Cafe'
    , url: 'http://www.yelp.com/biz/blue-front-cafe-san-francisco'
    , hours: {
      all: [7.5,22]
    }
  },
  {
      name: 'Hobson\'s Choice'
    , url: 'http://www.yelp.com/biz/hobsons-choice-san-francisco'
    , hours: {
        1: [14,26]
      , 2: [14,26]
      , 3: [14,26]
      , 4: [14,26]
      , 5: [14,26]
      , 6: [12,26]
      , 0: [12,26]
    }
  },
  {
      name: 'Magnolia'
    , url: 'http://www.yelp.com/biz/magnolia-pub-and-brewery-san-francisco'
    , hours: {
        1: [11,24]
      , 2: [11,24]
      , 3: [11,24]
      , 4: [11,24]
      , 5: [11,25]
      , 6: [10,25]
      , 0: [10,24]
    }
  },
  {
      name: 'Russ Cleaners'
    , url: 'http://www.yelp.com/biz/russ-cleaners-and-laundry-san-francisco-2'
    , hours: {
        1: [8,19]
      , 2: [8,19]
      , 3: [8,19]
      , 4: [8,19]
      , 5: [8,19]
      , 6: [10,17]
      , 0: [0,0]
    }
  },
  {
      name: 'Haight Street Market'
    , url: 'http://www.yelp.com/biz/haight-street-market-san-francisco'
    , hours: {
        all: [7,21]
    }
  },
];


jQuery.fn.orderBy = function(keySelector)
{
    return this.sort(function(a,b)
    {
        a = keySelector.apply(a);
        b = keySelector.apply(b);
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    });
};


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



function updateMUNI(){
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
    }
  ];
  
  var url = 'http://webservices.nextbus.com/service/publicXMLFeed',
      callbackCount = 0;

  //Loop through all routes
  MUNIroutes.forEach(function(route) {
    $.ajax({
      url: url,
      data: {
        command: 'predictions',
        a: 'sf-muni',
        r: route.route,
        s: route.stop
      },
      dataType: 'xml',
      success:function(result){
        var divName = 'muni' + route.route.toString().replace(/\s/g, '') + '_' + route.stop,
            div = $('#' + divName);

        callbackCount++;

        if(!div.length) {
          var routeName = route.route.toString().replace(/\s\D+/g, "<span>$&</span>").replace(/(\d)(L)/g, "$1<span>$2</span>"),
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
        div.toggle($(result).find('prediction').length > 0);
        
        var idx = 0;
        $(result).find('prediction').each(function(i, data){
          //Limit to 3 results, only show times less than 100, don't show results that are 0
          if(idx < 3 && $(data).attr('minutes') < 100 && $(data).attr('minutes') > 0){
            $('.time', div).eq(idx).html($(data).attr('minutes'));
            idx++;
          }
        });

        if(callbackCount == MUNIroutes.length) {
          $(".muni").orderBy(function() {return +$('.nextbus', this).text();}).appendTo("#times");
        }
      }
    });
  });
}

function updatePlaces(){
  var currentTime = new Date(),
      currentMinutes = currentTime.getMinutes(),
      currentHours = currentTime.getHours(),
      currentDay = currentTime.getDay();

  if(currentHours < 4){
    currentHours += 24;
    currentDay -= 1;
  }
  nearby.forEach(function(place){
    var divName = place.name.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~\s]/g, ''),
        div = $('#' + divName),
        hours = place.hours.all || place.hours[currentDay],
        status;

    if(!div.length) {
      var div = $('<div>')
        .addClass('place')
        .attr('id', divName)
        .append($('<div>')
          .addClass('status'))
        .append($('<a>')
          .addClass('storeName')
          .attr('href', place.url)
          .html(place.name))
        .append($('<span>')
          .addClass('countdown'))
        .appendTo('#nearby');
    }

    if(hours[1] - hours[0] == 24) {
      status = 'open';
    } else if(currentHours < hours[0] || currentHours >= hours[1]) {
      status = 'closed';
    } else if(currentHours == (hours[1] - 1) ) {
      status = 'closing';
    } else {
      status = 'open';
    }
    $(div).attr('data-status', status);
    $('.countdown', div).html(((currentMinutes - 60) * -1) + " min");
  });

  //sort
  $("#nearby .place").orderBy(function() {
    switch($(this).data('status')){
      case 'open':
        return 0;
        break;
      case 'closing':
        return 1;
        break;
      case 'closed':
        return 2;
        break;
    }
  }).appendTo("#nearby");
}

function updateFoursquare() {
  $.getJSON('/api/foursquare.json', function(data) {
    if(data && data.response) {
      data.response.recent.forEach(function(checkin) {
        var div;
        if(checkin.user.id == "4103624") {
          div = $('#joakim_foursquare');
        } else if(checkin.user.id == "2045886") {
          div = $('#trucy_foursquare');
        } else if(checkin.user.id == "2562440") {
          div = $('#mikael_foursquare');
        }
        if(div) {
          $('a', div)
            .html(checkin.venue.name)
            .attr('href', checkin.venue.canonicalUrl);
          var createdAt = new Date(checkin.createdAt * 1000);
          $('cite', div)
            .attr('title', createdAt.toISOString());
        }
      });
      $('#foursquare cite').timeago();
    }
  });
}

function updateInstagram() {
  $('#instagram .picture').remove();
  $.getJSON('/api/instagram.json', function(data) {
    if(data.length) {
      data.forEach(function(picture) {
        var createdAt = new Date(picture.created_time*1000);
        $('<div>')
          .addClass('picture')
          .append($('<img>')
            .attr('src', picture.images.standard_resolution.url))
          .append($('<div>')
            .addClass('userInfo')
            .html(picture.user.full_name)
            .append($('<span>')
              .addClass('timeago')
              .attr('title', createdAt.toISOString())))
          .appendTo('#instagram .scroll-wrap');
      });
      $('#instagram .timeago').timeago()
    }
  });
}

function scrollInstagram() {
  var first = $('#instagram .scroll-wrap .picture:first-child');
  $('#instagram .scroll-wrap').animate({top: -$(first).height()}, 800, function(){
    $('#instagram .scroll-wrap')
      .append(first)
      .css('top', 0);
  });
}


$(function(){

  //Update Clock every second
  setInterval(updateClock, 1000);
  
  //Get MUNI every 15 seconds
  updateMUNI();
  setInterval(updateMUNI, 15000);

  //check open times every minute
  updatePlaces();
  setInterval(updatePlaces, 60000);

  //update Foursquare every 5 minutes
  updateFoursquare();
  setInterval(updateFoursquare, 300000);

  //update Instagram every 30 minutes 
  updateInstagram();
  setInterval(updateInstagram, 1800000);

  //scroll Instagram every 5 seconds
  setInterval(scrollInstagram, 5000);
  
});