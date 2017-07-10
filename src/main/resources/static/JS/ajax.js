"use strict";

(() => {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;
  const goButton = $('#get-info');
  const cityInput = $('#city-input');
  const personsSelector = $('#persons-selector');
  const personsSelectorImage = $('#persons-image');
  const openMapsKey = $('#openWeatherMapKey').val();
  const onePersonImg = "./img/009-user-black-close-up-shape.svg";
  const twoPersonImg = "./img/010-couple-users-silhouette.svg";
  const threePersonImg = "./img/008-multiple-users-silhouette.svg";
  let radius = 25;
  let beds = 1;
  let locationDisplay = $('#location-info');
  let locationHeader = $('#location-name');
  const sanAntonioLocation = {lat: 29, lng: -98};
  const map = new google.maps.Map(document.getElementById('map'), {
    center: sanAntonioLocation,
    zoom: 16
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
          });
          $.ajax({
            url: data._links['ua:details'].href,
            type: "GET"
          }).done((data) => {
            buildDetails(data);
          });
        });
      });
    });
  };
  //===================WEATHER INFORMATION REQUESTS===================
  const requestWeather = (lat, lng) => {
    console.log(openMapsKey);
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?",
      data: {
      APPID: openMapsKey,
        units: "imperial",
        lat: lat,
        lon: lng
      }
    }).done((data) => {
      buildWeather(data);
    })
  };

  //===================JOB INFORMATION BUILDERS===================
  let buildLocationInfo = (data) => {
    console.log(data);
    $('#location-info').text(data);
  };

  let buildUrbanInfo = (data) => {
    locationHeader.text(data.full_name);
    console.log(data);

  };

  let buildScoreInfo = (data) => {
    const scoreArray = [];
    let sum = 0;
    let avg;
    locationDisplay.html(data.summary);
    data.categories.forEach((val) => {
      scoreArray.push(val.score_out_of_10);
    });

    scoreArray.forEach((val) => {
      sum += val;
      avg = (sum / 17);
    });
    $('#happiness').text(avg);
    console.log(avg);
    console.log(data);
  };

  let buildSalaryInfo = (data) => {
    console.log(data);
  };

  let locationImageDisplay = (data) => {
    $('#image-container').html(`<img  id="location-image" src="${data.photos[0].image.web}" alt="picture"/>`);
  };

  //Retrieves City Data from Teleport API and displays it to the view.
  let buildDetails = (data) => {
    $('#coffee-cost').text(data.categories[3].data[3].currency_dollar_value.toFixed(2));
    $('#fitness-cost').text(data.categories[3].data[5].currency_dollar_value.toFixed(2));
    $('#meal-cost').text(data.categories[3].data[8].currency_dollar_value.toFixed(2));
    console.log(data.categories);
  };

  const buildWeather = (data) => {
    console.log(data);
    $('#today-temp').text(data.main.temp);
  };

  //========================GOOGLE API METHODS========================
  let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city-input'));
  autocomplete.bindTo('bounds', map);

  //Takes input from the search bar and sends it to the getLocationInfo() method. Also re-centers the map onto the location specified.
  const geoCoder = () => {
    (!cityInput.val().match(/([0-9])+/)) ? alert('needs to be an address.' +
        '') : geoCodeIt.geocode({'address': cityInput.val()},
      (results, status) => {
        if(status =='OK') {
          map.setCenter(results[0].geometry.location);
          new google.maps.Marker({
            postion: results[0].geometry.location,
            map: map
          });
          console.log(results[0].address_components[3].long_name);
          getLocationInfo(results[0].address_components[3].long_name);
          jobSearchByArea(results[0].address_components[3].long_name);
          console.log(results);
          requestWeather(results[0].geometry.location.lat, results[0].geometry.location.lng);
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
        jc: "29",
        userip: ip,
        radius: radius,
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

  const personsImageChanger = () => {
    (beds < 3) ? beds++  : beds = 1;

    switch(beds) {
      case 1: personsSelectorImage.attr('src', onePersonImg);
        console.log(beds);
        break;
      case 2: personsSelectorImage.attr('src', twoPersonImg);
        console.log(beds);
        break;
      case 3: personsSelectorImage.attr('src', threePersonImg);
        console.log(beds);
        break;
      default: return null;
    }
  };

  personsSelectorImage.on('click', () => {
    console.log('Click!');
    personsImageChanger(beds);
    console.log(beds);
  });

  //=================CLICKING AND KEYSTROKES FUNCTIONS==================

  //TODO Fix this Go button functionality
  goButton.submit(geoCoder());

  $(document).keyup(function(e){
    if (e.keyCode === 13) {
      geoCoder(beds);
    }
  });

})();