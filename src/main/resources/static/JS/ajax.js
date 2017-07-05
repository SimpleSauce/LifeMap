"use strict";

(() => {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;
  const cityInput = $('#city-input');
  const goButton = $('#get-info');

  // let map = new google.maps.Map($('#map')[0], {
  //   center: {lat: 29.427038, lng: -98.489576},
  //   zoom: 15
  // });
  //
  // let marker = new google.maps.Marker({
  //   position: map.center,
  //   map: map
  // });
  //
  // let pos;
  //
  //
  // function geoCoder(cnt) {
  //   if(cityInput.val()) {
  //     geoCodeIt.geocode({'address': cityInput.val()},
  //         function (results, status) {
  //           if (status == 'OK') {
  //             map.setCenter(results[0].geometry.location);
  //             new google.maps.Marker({
  //               postion: results[0].geometry.location,
  //               map: map
  //             });
  //             console.log(cnt);
  //             getWeather(results[0].geometry.location.lat(), results[0].geometry.location.lng(), cnt);
  //           } else {
  //             console.log("Geocode wasn't successful for reason: " + status);
  //           }
  //         });
  //   } else{
  //     getWeather(marker.position.lat(), marker.position.lng(), cnt);
  //   }
  // }
  //
  // function initMap() {
  //
  //   let map = new google.maps.Map($('#map')[0], {
  //     center: pos,
  //     zoom: 15
  //   });
  //
  //   marker.setMap(map);
  //   marker.setPosition(pos);
  //
  //   //This forces the marker --once user has dragged it-- to input its current latitude and longitude into the variables 'lat' and 'lng' respectively. It will then center the map on those coordinates and send the coordinates to the getWeather function.
  //   markerDrop(marker);
  // }
  //
  // //Ajax Requesters======================================
  // let mapRequest = () => {
  //   $.ajax({
  //
  //   }).done(() => {
  //
  //   });
  // };

  //===================LOCATION AJAX REQUEST/BUILD===================
  const getLocationInfo = () => {
    $.ajax({
      url: "https://api.teleport.org/api/cities/?search=" + $('#city-input').val(),
      type: "GET"
    }).done((data) => {
      buildLocation(data);
    });

    $.ajax({
      url: "https://api.teleport.org/api/urban_areas/slug:" + $('#city-input').val(),
      type: "GET"
    }).done((data) => {
      buildLocation(urbanData);
    });
  };

  const buildLocation = (data, urbanData) => {
    console.log(data);
    $('#location-name').text(data._embedded['city:search-results'][0].matching_alternate_names[0].name);
    $('#location-info').text(data);
  };
  //===================JOB AJAX REQUEST/BUILD===================
  const getJobInfo = () => {
    $.ajax({

    }).done(() => {

    });
  };

  let buildJobInfo = (data) => {

  };

  //
  // let getWeather = (lat, long, cnt) => {
  //   $.ajax({
  //     url: "http://api.openweathermap.org/data/2.5/forecast/daily",
  //     type: "GET",
  //     data: {
  //       APPID: "cfdaa9b51b09b5239ab50c12797419d3",
  //       units: "imperial",
  //       lat: lat,
  //       lon: long,
  //       cnt: cnt
  //     }
  //   }).done((data, status) => {
  //     buildWeather(data);
  //   });
  // };
  //
  //
  // let buildWeather = (data) => {
  // };

  $(document).keyup(function(e){

    if (e.keyCode === 13) {
      getLocationInfo();
      // geoCoder(3);
    }
  });

})();