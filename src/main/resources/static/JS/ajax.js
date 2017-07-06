"use strict";

(() => {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;
  const goButton = $('#get-info');
  let locationDisplay = $('#location-info');
  let locationHeader = $('#location-name');

  //===================LOCATION AJAX REQUEST/BUILD===================
  const getLocationInfo = () => {
    // let parsedInput = $('#city-input').val().replace(/\s+/g , '-');
    $.ajax({
      url: "https://api.teleport.org/api/cities/?search=" + $('#city-input').val(),
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
    console.log(data);
    $('#location-info').text(data);

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
  let map;
  function initMap() {
    map = new google.maps.Map($('#map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }

  $(document).keyup(function(e){

    if (e.keyCode === 13) {
      getLocationInfo();
      geoCoder();
    }
  });

})();