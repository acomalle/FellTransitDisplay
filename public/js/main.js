
function updateClock() {
  var currentTime = new Date(),
      currentHours = currentTime.getHours(),
      currentMinutes = currentTime.getMinutes(),
      currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Choose either "AM" or "PM" as appropriate
  var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  // Convert the hours component to 12-hour format if needed
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

  // Update the time display
  $('#clock').html(currentTimeString);
}



function getMUNI(){
  //Define Muni Roures
  var MUNIroutes = [
  {
    route: 5,
    stop: 15390
  },
  {
    route: 6,
    stop: 14951
  },
  {
    route: 21,
    stop: 14992
  },
  {
    route: 22,
    stop: 14632
  },
  {
    route: 71,
    stop: 14951
  },
  {
    route: '71L',
    stop: 14951
  },
  {
    route: 'N',
    stop: 17318
  },
  {
    route: 'N OWL',
    stop: 14951
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
        var div = $('#muni' + route.toString().replace(/\s/g, '') + '_' + stop);
        
        //Clear old times
        $('.times', div).html('');
        
        //Check if route is still running
        if($(result).find('prediction').length > 0){
          div.show();
          
          var count = 0;
          
          $(result).find('prediction').each(function(i, data){
            //Limit to 3 results, only show times less than 100, don't show results that are 0
            if(count < 3 && $(data).attr('minutes') < 100 && $(data).attr('minutes') > 0){
              
              $('.times', div).append('<span>' + $(data).attr('minutes') + '</span>');
              
              count++;
            }
          });
        } else {
          div.hide();
        }
      }
    });
  }

  //Loop through all routes
  for(var i in MUNIroutes){
    getRoute(MUNIroutes[i].route, MUNIroutes[i].stop);
  }
}


$(document).ready(function(){

  //Update Clock
  setInterval(updateClock, 1000);
  
  //Get MUNI
  getMUNI()
  setInterval(getMUNI, 15000);
});