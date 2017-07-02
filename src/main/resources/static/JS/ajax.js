"use strict";

(() => {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;

  let map = new google.maps.Map($('#htmlElementName')[0], {
    center: {lat: 29.427038, lng: -98.489576},
    zoom: 15
  });

  let marker = new google.maps.Marker({
    position: map.center,
    map: map,
  });

  let pos;

  //Ajax Requesters======================================
  function initMap() {

    let map = new google.maps.Map($('#map')[0], {
      center: pos,
      zoom: 15
    });

    marker.setMap(map);
    marker.setPosition(pos);

    //This forces the marker --once user has dragged it-- to input its current latitude and longitude into the variables 'lat' and 'lng' respectively. It will then center the map on those coordinates and send the coordinates to the getWeather function.
    markerDrop(marker);
  }

  let mapRequest = () => {
    $.ajax().done(() => {

    });
  };

  let locationRequest = () => {
    $.ajax().done(() => {

    });
  };

  let jobRequest = () => {
    $.ajax().done(() => {

    });
  };

  let getWeather = () => {
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast/daily",
      type: "GET",
      data: {
        APPID: "cfdaa9b51b09b5239ab50c12797419d3",
        units: "imperial",
        lat: lat,
        lon: long,
        cnt: cnt
      }
    }).done((data, status) => {
      buildWeather(data);
    });
  };


  let buildWeather = (data) => {

  };

})();
