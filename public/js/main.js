jQuery.fn.orderBy = function(keySelector) {
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
          var div = $('<div>')
            .addClass('muni')
            .attr('id', divName)
            .append($('<div>')
              .addClass('busnumber')
              .html(route.toString()))
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
            console.log(idx)
            console.log($(data).attr('minutes'))
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


$(document).ready(function(){

  //Update Clock
  setInterval(updateClock, 1000);
  
  //Get MUNI
  getMUNI()
  setInterval(getMUNI, 15000);
});