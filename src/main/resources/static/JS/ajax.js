"use strict";

(() => {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;
  const goButton = $('#get-info');
  let locationDisplay = $('#location-info');
  let locationHeader = $('#location-name');
  const sanAntonioLocation = {lat: 29, lng: -98};
  const map = new google.maps.Map(document.getElementById('map'), {
    center: sanAntonioLocation,
    zoom: 14
  });

  //===================LOCATION AJAX REQUEST/BUILD===================
  const getLocationInfo = (cityName) => {
    $.ajax({
      url: "https://api.teleport.org/api/cities/?search=" + cityName,
      type: "GET"
    }).done((data) => {
      $.ajax({
        url: data._embedded['city:search-results'][0]._links['city:item'].href,
        type: "GET"
      }).done((data) => {
        buildLocationInfo(data);
        $.ajax({
          url: data._links['city:urban_area'].href,
          type: "GET"
        }).done((data) => {
          buildUrbanInfo(data);
          $.ajax({
            url: data._links['ua:scores'].href,
            type: "GET"
          }).done((data) => {
            buildScoreInfo(data);
          });
          $.ajax({
            url: data._links['ua:salaries'].href,
            type: "GET"
          }).done((data) => {
            buildSalaryInfo(data);
          });
          $.ajax({
            url: data._links['ua:images'].href,
            type: "GET"
          }).done((data) => {
            locationImageDisplay(data);
          })
        });
      });
    });
  };

  //===================JOB INFORMATION BUILDERS===================


  let buildLocationInfo = (data) => {
    let lat = data.location.latlon.latitude;
    let lng = data.location.latlon.longitude;
    console.log(data);
    $('#location-info').text(data);
    map.setCenter({lat: lat, lng: lng});
  };

  let buildUrbanInfo = (data) => {
    locationHeader.text(data.full_name);
    console.log(data);

  };

  let buildScoreInfo = (data) => {
    locationDisplay.html(data.summary);
    console.log(data);
  };

  let buildSalaryInfo = (data) => {
    console.log(data);
  };

  let locationImageDisplay = (data) => {
    $('#location-image').html(`<img src="${data.photos[0].image.web}" alt="picture"/>`);
    console.log(data);
  };

  //========================GOOGLE API METHODS========================
  let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city-input'));
  autocomplete.bindTo('bounds', map);
  //Takes input from the search bar and sends it to the getLocationInfo() method. Also re-centers the map onto the location specified.
  const geoCoder = () => {
    geoCodeIt.geocode({'address': $('#city-input').val()},
      (results, status) => {
        if(status =='OK') {
          map.setCenter(results[0].geometry.location);
          new google.maps.Marker({
            postion: results[0].geometry.location,
            map: map
          });
          console.log(results[0].address_components[3].long_name);
          getLocationInfo(results[0].address_components[3].long_name)
        } else {
          console.log("Geocode wasn't successful for reason: " + status);
        }
      }
    );
  };

  //========================GLASSDOOR API METHODS========================
  //Retrieves end-user's IP address from Json object and transfers it to the GlassDoor API.
  $.getJSON('https://freegeoip.net/json/', function(data) {
  let ip = data.ip;
  jobSearchByArea(ip);
  });

  //Retrieves Job information by state from GlassDoor API
  const jobSearchByArea = (ip, location) => {
    const request = $.ajax({
      url: "http://api.glassdoor.com/api/api.htm?t.p=167558&t.k=kRjES33TNWE",
      dataType: "jsonp",
      data: {
        userip: ip,
        // radius: "25",
        useragent: '',
        format: "json",
        l: location,
        action: "jobs-stats",
        v: "1",
        returnStates: "false",
        admLevelRequested: "1"
      }
    });
    request.done((data) => {
      console.log(data);
    })
  };

  $(document).keyup(function(e){

    if (e.keyCode === 13) {
      geoCoder();
    }
  });

})();