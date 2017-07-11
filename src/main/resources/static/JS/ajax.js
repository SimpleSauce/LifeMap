"use strict";

(() = > {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;
  const degreeSymbol = '\u2109';
  const goButton = $('#get-info');
  const cityInput = $('#city-input');
  const openMapsKey = $('#openWeatherMapKey').val();
  const indeedKey = $('#indeedKey').val();
  const coffeeImg = "./img/011-coffee.svg";
  const mealImg = "./img/006-cereal.svg";
  const fitnessImg = "./img/007-weightlifting.svg";
  const happyImg = "./img/004-happy.svg";
  const sadImg = "./img/003-arrogant.svg";
  const expandImg = "./img/expand-btn.svg";
  const workHarderImg = "./img/workharder.png";
  let radius = 25;
  const cardContainer = $('#info-card-container');
  let locationDisplay = $('#location-info');
  let locationHeader = $('#location-name');
  const sanAntonioLocation = {lat: 29, lng: -98};
  let markers = [];
  let jobsArray = [];
  const map = new google.maps.Map(document.getElementById('map'), {
    center: sanAntonioLocation,
    zoom: 16
  });

//========================GOOGLE API METHODS========================
let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city-input'));
autocomplete.bindTo('bounds', map);

//Takes input from the search bar and sends it to the getLocationInfo() method. Also re-centers the map onto the location specified.
const geoCoder = () =
>
{
    (!cityInput.val().match(/([0-9])+/) && cityInput.val() !== '') ? alert('needs to be an address.' +
        '') : geoCodeIt.geocode({'address': cityInput.val()},
            (results, status) = > {
            if(status == 'OK'
)
    {
        map.setCenter(results[0].geometry.location);
        addLocationMarker(results[0].geometry.location, map);
        console.log(results);
        //Calls these two methods and passes the City Name (which Teleport API is set up to use).
        getLocationInfo(results[0].address_components[3].long_name);

        //If the results include the zipcode in the 5th index, send to ipGetter. Otherwise, send the 7th index.
        if (results[0].address_components[5].long_name.match(/([0-9])+/)) {
            ipGetter(results[0].address_components[5].short_name);
        } else ipGetter(results[0].address_components[7].short_name);

        //Calls requestWeather and passes the latitude and longitude from results.
        requestWeather(results[0].geometry.location.lat, results[0].geometry.location.lng);
    }
else
    {
        console.log("Geocode wasn't successful for reason: " + status);
    }
}
)
    ;
}
;

const addLocationMarker = (location, map) =
>
{
    let marker = new google.maps.Marker({
        position: location,
        map: map
    });
}
;

  //===================LOCATION AJAX REQUEST/BUILD===================
  const getLocationInfo = (cityName) => {
    $.ajax({
        url: "https://api.teleport.org/api/cities/?search=" + cityName,
        type: "GET"
    }).done((data) = > {
        $.ajax({
        url: data._embedded['city:search-results'][0]._links['city:item'].href,
        type: "GET"
    }).done((data) = > {
        buildLocationInfo(data);
    $.ajax({
        url: data._links['city:urban_area'].href,
        type: "GET"
    }).done((data) = > {
        buildUrbanInfo(data);
    $.ajax({
        url: data._links['ua:scores'].href,
        type: "GET"
    }).done((data) = > {
        buildScoreInfo(data);
    });
    $.ajax({
        url: data._links['ua:salaries'].href,
        type: "GET"
    }).done((data) = > {
        buildSalaryInfo(data);
    });
    $.ajax({
        url: data._links['ua:images'].href,
        type: "GET"
    }).done((data) = > {
        locationImageDisplay(data);
    });
    $.ajax({
        url: data._links['ua:details'].href,
        type: "GET"
    }).done((data) = > {
        buildDetails(data);
    });
  });
});
});
};

//===================WEATHER INFORMATION REQUESTS===================
const requestWeather = (lat, lng) =
>
{
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?",
        data: {
            APPID: openMapsKey,
            units: "imperial",
            lat: lat,
            lon: lng
        }
    }).done((data) = > {
        buildWeather(data);
})
}
;

//===================INFORMATION BUILDERS FOR THE VIEW===================
let buildLocationInfo = (data) =
>
{
    // console.log(data);
    $('#location-info').text(data);
}
;

let buildUrbanInfo = (data) =
>
{
    locationHeader.text(data.full_name);
    // console.log(data);
}
;

//Takes 17 metrics (provided by Teleport API), and averages them all to produce a single metric.
let buildScoreInfo = (data) =
>
{
    const scoreArray = [];
    let sum = 0;
    let avg;
    locationDisplay.html(data.summary);
    data.categories.forEach((val) = > {
        scoreArray.push(val.score_out_of_10);
})
    ;
    scoreArray.forEach((val) = > {
        sum += val;
    avg = (sum / 17).toFixed(1);
})
    ;

    if (avg >= 6) {
        cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="happiness-img" class="section">
        <div class="info-card" id="happiness">
          <img class="info-card-img" src="${happyImg}" alt="happiness">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          ${avg}
        </div>
      </div>
      `);
    } else {
        cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="happiness-img" class="section">
        <div class="info-card" id="happiness">
          <img class="info-card-img" src="${sadImg}" alt="happiness">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          ${avg}
        </div>
      </div>
      `);
    }

    // console.log(avg);
    // console.log(data);
}
;

  let buildSalaryInfo = (data) => {

    console.log(data);
    let selectBox = '';

    data.salaries.forEach((val) => {
      selectBox += `<option value="${val.job.title}">${val.job.title}</option>`;
    });

    let htmlString = `<div class="colored-tile"></div>
        <div id="salary-img" class="section">
        <div class="info-card" id="coffee-cost">
        <img class="info-card-img" src="" alt="coffee">
        <select id="job-dropdown">
        ${selectBox}
        </select>
        </div>
        </div>`;

    cardContainer.append(htmlString);
  };

let locationImageDisplay = (data) =
>
{
    $('#image-container').html(`<img id="location-image" src="${data.photos[0].image.web}" alt="picture"/>`);
}
;

  let userDetails = (data) => {

  };

  //Retrieves City Data from Teleport API and displays it to the Index view.
  let buildDetails = (data) => {
    //Housing Variables

    let smApt = data.categories[8].data[2].currency_dollar_value.toFixed(0);
    let medApt = data.categories[8].data[1].currency_dollar_value.toFixed(0);
    let lgApt = data.categories[8].data[0].currency_dollar_value.toFixed(0);

    //Cost Of Living Variables
    let coffeeCost = data.categories[3].data[3].currency_dollar_value.toFixed(2);
    let fitnessCost = data.categories[3].data[5].currency_dollar_value.toFixed(2);
    let mealCost = data.categories[3].data[8].currency_dollar_value.toFixed(2);

    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="startup-img" class="section">
        <div class="info-card" id="startup-info">
          <img class="info-card-img" src="${coffeeImg}" alt="coffee">
          $${coffeeCost}
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="coffee-img" class="section">
        <div class="info-card" id="coffee-cost">
          <img class="info-card-img" src="${coffeeImg}" alt="coffee">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          $${data.categories[3].data[3].currency_dollar_value.toFixed(2)}
          $${coffeeCost}
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="fitness-img" class="section">
        <div class="info-card" id="fitness-cost">
          <img class="info-card-img" src="${fitnessImg}" alt="fitness">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          $${data.categories[3].data[5].currency_dollar_value.toFixed(2)}
          $${fitnessCost}
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="meal-img" class="section">
        <div class="info-card" id="meal-cost">
          <img class="info-card-img" src="${mealImg}" alt="meal">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          $${data.categories[3].data[8].currency_dollar_value.toFixed(2)}
          $${mealCost}
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="apartment-img" class="section">
        <div class="info-card" id="apartment-cost">
        <img class="expand-btn" src="${expandImg}" alt="expand">
          <span>Large Apartment: $${lgApt}</span>
          <span>Medium Apartment: $${medApt}</span>
          <span>Small Apartment: $${smApt}</span>
        </div>
      </div>
    `);
    // console.log(data.categories);
}
;

const buildWeather = (data) => {
    // console.log(data);
    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="weather-img" class="section">
        <div class="info-card" id="today-temp">
        <img class="expand-btn" src="${expandImg}" alt="expand">
          ${data.main.temp.toFixed(0) + degreeSymbol}
        </div>
      </div>
    `);
  };

//========================Indeed API METHODS========================
//Retrieves end-user's IP address from Json object and transfers it to the GlassDoor API.
//Also receives the 'location' parameter from the geoCoder function as a City, State.
const ipGetter = (location) =
>
{
    $.getJSON('https://freegeoip.net/json/', function (data) {
        let ip = data.ip;
        jobSearchByArea(ip, location);
    });
}
;

//Retrieves Job information from Indeed API.
// NOTE: indeedKey is api key in application.properties. It is passed to ajax.js through hidden input.
const jobSearchByArea = (ip, location) =
>
{
    const request = $.ajax({
      url: "http://api.indeed.com/ads/apisearch?",
      dataType: "jsonp",
      data: {
        st: "jobsite",
        publisher: indeedKey,
        jc: "29",
        userip: ip,
        radius: radius,
        useragent: '',
        format: "json",
        l: location,
        latlong: "1",
        v: "2",
      }
    });
    request.done((data) => {
      console.log(data);
      // jobsArrayPusher(data);
    })
  };

//=================CLICKING AND KEYSTROKES FUNCTIONS==================
//Clicking the "Go" button or pressing the "Enter" key will clear current info and request new info.
const divClear = () =
>
{
    cardContainer.html('');
}
;

goButton.on('click', () = > {
    divClear();
geoCoder();
})
;

$(document).keyup(function (e) {
    if (e.keyCode === 13) {
        divClear();
        geoCoder();
    }
});
})();