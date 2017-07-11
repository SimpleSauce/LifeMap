"use strict";

(() => {

  //Variable Declarations================================
  const geoCodeIt = new google.maps.Geocoder;
  const degreeSymbol = '\u2109';
  const goButton = $('#get-info');
  const cityInput = $('#city-input');
  const openMapsKey = $('#openWeatherMapKey').val();
  const indeedKey = $('#indeedKey').val();
  const coffeeImg = './img/011-coffee.svg';
  const mealImg = './img/006-cereal.svg';
  const fitnessImg = './img/007-weightlifting.svg';
  const happyImg = './img/004-happy.svg';
  const sadImg = './img/003-arrogant.svg';
  const expandImg = './img/expand-btn.svg';
  const workHarderImg = './img/workharder.png';
  const startupImg = './img/005-team.svg';
  const cinemaImg = './img/002-theater.svg';
  const safetyImg = './img/003-burglar.svg';
  const salaryImg = './img/004-salary.svg';
  const pollutionImg = './img/001-factory.svg';
  let radius = 25;
  const cardContainer = $('#info-card-container');
  let locationDisplay = $('#location-info');
  let locationHeader = $('#location-name');
  const sanAntonioLocation = {lat: 29, lng: -98};
  let currentTemp;
  const map = new google.maps.Map(document.getElementById('map'), {
    center: sanAntonioLocation,
    zoom: 16
  });

  $.getJSON('https://freegeoip.net/json/', function(data) {
    let ip = data.ip;
    console.log(data);
    jobSearchByArea(ip, location);
  });

  //========================GOOGLE API METHODS========================
  let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city-input'));
  autocomplete.bindTo('bounds', map);

  //Takes input from the search bar and sends it to the getLocationInfo() method. Also re-centers the map onto the location specified.
  const geoCoder = () => {
    if(!cityInput.val().match(/([0-9])+/) && cityInput.val() !== '') {
      geoCodeIt.geocode({'address': ipGetter(ip)})
    } else geoCodeIt.geocode({'address': cityInput.val()},
      (results, status) => {
        if(status =='OK') {
          map.setCenter(results[0].geometry.location);
          addLocationMarker(results[0].geometry.location, map);
          console.log(results);
          //Calls these two methods and passes the City Name (which Teleport API is set up to use).
          getLocationInfo(results[0].address_components[3].long_name);

          //If the results include the zipcode in the 5th index, send to ipGetter. Otherwise, send the 7th index.
          // if(results[0].address_components[5].long_name.match(/([0-9])+/)) {
          //   ipGetter(results[0].address_components[5].short_name);
          // } else ipGetter(results[0].address_components[7].short_name);

          //Calls requestWeather and passes the latitude and longitude from results.
          requestWeather(results[0].geometry.location.lat, results[0].geometry.location.lng);
        } else {
          console.log("Geocode wasn't successful for reason: " + status);
        }
      }
    );
  };

  const addLocationMarker = (location, map) => {
    let marker = new google.maps.Marker({
      position: location,
      map: map
    });
  };

  //===================TELEPORT API AJAX REQUEST/BUILD===================
  const getLocationInfo = (cityName) => {
    let urlArray = ['data._links[ua:scores].href', 'data._links[ua:salaries].href', 'data._links[ua:images].href', 'data._links[ua:details].href'];
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
          }).done((data) => buildScoreInfo(data));
          $.ajax({
            url: data._links['ua:salaries'].href,
            type: "GET"
          }).done((data) => buildSalaryInfo(data));
          $.ajax({
            url: data._links['ua:images'].href,
            type: "GET"
          }).done((data) => locationImageDisplay(data));
          $.ajax({
            url: data._links['ua:details'].href,
            type: "GET"
          }).done((data) => buildDetails(data));
        });
      });
    });
  };

  // const urlLooper = (data) => {
  //   urlArray.forEach(url => {
  //     $.ajax({ url, type: "GET" }).done(data => reqHandler(data));
  //   });
  // };
  //
  // const reqHandler = (data) => {
  //   if(data.hasOwnProperty('categories[17]')) {
  //     buildDetails(data)
  //   } else if(data.hasOwnProperty('salaries')) {
  //     buildSalaryInfo(data)
  //   } else if(data.hasOwnProperty('photos')) {
  //     locationImageDisplay(data)
  //   } else buildScoreInfo()
  // };

  //===================WEATHER INFORMATION REQUESTS===================
  const requestWeather = (lat, lng) => {
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

  //===================INFORMATION BUILDERS FOR THE VIEW===================
  let buildLocationInfo = (data) => {
    // console.log(data);
    $('#location-info').text(data);
  };

  let buildUrbanInfo = (data) => {
    locationHeader.text(data.full_name);
    // console.log(data);
  };

  //Takes 17 metrics (provided by Teleport API), and averages them all to produce a single metric.
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
      avg = (sum / 17).toFixed(1);
    });

    if(avg >= 6) {
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
  };

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

  let locationImageDisplay = (data) => {
    $('#image-container').html(`<img id="location-image" src="${data.photos[0].image.web}" alt="picture"/>`);
  };

  let userDetails = (data) => {

  };

  //Retrieves City Data from Teleport API and displays it to the Index view.
  let buildDetails = (data) => {
    //Overall Variables
    const cat = data.categories;

    console.log(cat[17]);

    //Housing Variables
    let smApt = cat[8].data[2].currency_dollar_value.toFixed(0);
    let medApt = cat[8].data[1].currency_dollar_value.toFixed(0);
    let lgApt = cat[8].data[0].currency_dollar_value.toFixed(0);

    //Cost Of Living Variables
    let coffeeCost = cat[3].data[3].currency_dollar_value.toFixed(2);
    let fitnessCost = cat[3].data[5].currency_dollar_value.toFixed(2);
    let beerCost = cat[3].data[6].currency_dollar_value.toFixed(2);
    let mealCost = cat[3].data[8].currency_dollar_value.toFixed(2);
    let cinemaCost = cat[3].data[4].currency_dollar_value.toFixed(2);
    let pubTransCost = cat[3].data[7].currency_dollar_value.toFixed(2);

    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();

    //Monthly and Daily Living Cost Estimators
    const monthlyLiving = ((fitnessCost + pubTransCost + medApt) + (beerCost * 32) + (cinemaCost * 2));
    const dailyliving = (((coffeeCost + mealCost) * 15) + (pubTransCost / 30));

    //Startup Variables
    let avgStartupScore = cat[17].data[12].float_value;
    let avgStartupIncrease = cat[17].data[11].int_value;
    let investors = cat[17].data[10].int_value;
    let workFromCoNum = cat[17].data[14].int_value;
    //EXTRAS
    let coWorkScore = cat[17].data[0].float_value;
    let eventsCount = cat[17].data[1].int_value;
    let eventsLstYr = cat[17].data[2].int_value;
    let eventsScore = cat[17].data[3].float_value;
    let fundrBmStrtups = cat[17].data[4].int_value;
    let meetupEvents = cat[17].data[5].int_value;
    let meetupGroups = cat[17].data[6].int_value;
    let meetupMembers = cat[17].data[7].int_value;
    let meetupScore = cat[17].data[9].int_value;

    //Weather Variables (all extras)//
    let avgRainy = cat[2].data[2].float_value;
    let climate = cat[2].data[7].string_value;
    let dayLength = cat[2].data[0].float_value;
    let avgLowTemp = (parseFloat(cat[2].data[5].string_value) * 9 / 5 + 32);
    let avgHighTemp = (parseFloat(cat[2].data[4].string_value) * 9 / 5 + 32);

    cardContainer.append(`
      <div class="colored-tile">
        <span>Startups</span>
      </div>
      <div id="startup-img" class="section">
        <div class="info-card" id="startup-info">
          <img class="info-card-img" src="${startupImg}" alt="coffee">
          <span>Average Startup Score: ${avgStartupScore}</span>
          <span>Average Startup Increase (Monthly): ${avgStartupIncrease}</span>
          <span>Startup Climate Investors: ${investors}</span>
          <span>WorkFrom.Co Co-Working Spaces: ${workFromCoNum}</span>
        </div>
        <div class="extra-info">
          <span>Co-Working Spaces Score (out of 100): ${coWorkScore}</span>
          <span>Startup Events Score (out of 100): ${eventsScore}</span>
          <span>Meetups Score (out of 100): ${meetupScore}</span>
          <span>Startup Events This Month: ${eventsCount}</span>
          <span>Startup Events The Last 12 Months: ${eventsLstYr}</span>
          <span>FunderBeam Total Startups: ${fundrBmStrtups}</span>
          <span>Total Upcoming Meetups: ${meetupEvents}</span>
          <span>Meetups Groups: ${meetupGroups}</span>
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span>Average Cost of Living</span>
      </div>
      <div id="living-cost-img" class="section">
        <div class="info-card">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          <span>Daily Average: ${dailyliving}</span>
          <span>Monthly Average: ${monthlyLiving}</span>
        </div>
        <div class="extra-info">
          <img class="info-card-img" src="${coffeeImg}" alt="coffee">$${coffeeCost}
          <img class="info-card-img" src="${fitnessImg}" alt="fitness">$${fitnessCost}
          <img class="info-card-img" src="${mealImg}" alt="meal">$${mealCost}
          <img class="info-card-img" src="${cinemaImg}" alt="meal"><span>$${cinemaCost}</span>
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span>Culture</span>
      </div>
      <div id="culture-img" class="section">
        <div class="info-card">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span>Pollution</span>
      </div>
      <div id="safety-img" class="section">
        <div class="info-card">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span>Weather</span>
      </div>
      <div id="weather-img" class="section">
        <div class="info-card">
          <img class="expand-btn" src="${expandImg}" alt="expand">
        </div>
        <div class="extra-info">
          <span id="averages-title">Averages</span>
          <span>Day Length: ${dayLength}</span>
          <span>High/Low Temps: ${avgHighTemp}/${avgLowTemp}</span>
          <span>Rainy Days/Year: ${avgRainy}</span>
          <span>Climate Type: ${climate}</span>
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span>Safety</span>
      </div>
      <div id="safety-img" class="section">
        <div class="info-card">
          <img class="expand-btn" src="${expandImg}" alt="expand">
          
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span>Apartment Rentals</span>
      </div>
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
  };

  const buildWeather = (data) => {
    currentTemp = data.main.temp.toFixed(0);
    // console.log(data);
    cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="weather-img" class="section">
        <div class="info-card" id="today-temp">
        <img class="expand-btn" src="${expandImg}" alt="expand">
          ${currentTemp + degreeSymbol}
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
  };

  //========================Indeed API METHODS========================
  //Retrieves end-user's IP address from Json object and transfers it to the GlassDoor API.
  //Also receives the 'location' parameter from the geoCoder function as a City, State.
  // const ipGetter = (location) => {

  // });

  //Retrieves Job information from Indeed API.
  // NOTE: indeedKey is api key in application.properties. It is passed to ajax.js through hidden input.
  const jobSearchByArea = (ip, location) => {
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
    })
  };

  const infoDropdown = () => {
    $(this).parent().next(".extra-info").slideToggle(300);
  };

  //=================CLICKING AND KEYSTROKES FUNCTIONS==================
  //Clicking the "Go" button or pressing the "Enter" key will clear current info and request new info.
  const divClear = () => {
    cardContainer.html('');
  };

  $('.expand-btn').on('click', () => {
    infoDropdown();
  });

  goButton.on('click', () => {
    divClear();
    geoCoder();
  });

  $(document).keyup((e) => {
    if (e.keyCode === 13) {
      divClear();
      geoCoder();
    }
  });

})();