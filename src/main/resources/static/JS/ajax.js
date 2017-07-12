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

  //========================GOOGLE API METHODS========================
  let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city-input'));
  autocomplete.bindTo('bounds', map);

  //Takes input from the search bar and sends it to the getLocationInfo() method. Also re-centers the map onto the location specified.
  //TODO Add ability to search by address, City, or City and State
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
          requestWeather(results[0].geometry.location.lat, results[0].geometry.location.lng);
        } else {
          console.log("Geocode wasn't successful for reason: " + status);
        }
    });
  };

  const addLocationMarker = (location, map) => {
    let marker = new google.maps.Marker({
        position: location,
        map: map
    });
  };

  //TODO Change this ajax tree to be shorter and more efficient.
  //===================TELEPORT API AJAX REQUEST/BUILD===================
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
            url: data._links['ua:images'].href,
            type: "GET"
          }).done(data => locationImageDisplay(data));
          $.ajax({
            url: data._links['ua:salaries'].href,
            type: "GET"
          }).done(data => buildSalaryInfo(data));
          $.ajax({
            url: data._links['ua:scores'].href,
            type: "GET"
          }).done(data => buildScoreInfo(data));
          $.ajax({
            url: data._links['ua:details'].href,
            type: "GET"
          }).done(data => buildDetails(data));
        });
      });
    });
  };

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

    //TODO Add all metrics involved in making the overall happiness
    if (avg >= 5) {
        cardContainer.append(`
      <div class="colored-tile"></div>
      <div id="happiness-img" class="section">
        <div class="info-card" id="happiness">
          <img class="info-card-img" src="${happyImg}" alt="happiness">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
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
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
          ${avg}
        </div>
      </div>
    `);
    }

    // console.log(avg);
    // console.log(data);
  };

  let locationImageDisplay = (data) => {
      $('#image-container').html(`<img id="location-image" src="${data.photos[0].image.web}" alt="picture"/>`);
  };

  let buildSalaryInfo = (data) => {
    console.log(data);

    let selectBox = '<option disabled="disabled" selected="selected">Choose a Job</option>';

    data.salaries.forEach((val) => {
      let salary = parseFloat(val.salary_percentiles.percentile_50).toFixed(0);
      selectBox += `<option class="industry-option" value="$${salary}">${val.job.title}</option>`;

    });

    let htmlString = `<div class="colored-tile">
                         <span class="intro-title"> Average Salaries (by Industry)</span>
                      </div>
      <div id="salary-img" class="section">
        <div class="info-card">
          <label for="industry-dropdown" id="dropdown-label">Industry</label>
          <select id="job-dropdown" name="industry-dropdown">
            ${selectBox}
          </select>
          <div>
            <span id="salary-median"></span>
          </div>
        </div>
      </div>`;
      cardContainer.append(htmlString);

    //Add Click functionality to change salary that appears based on selection.
    $('#job-dropdown').on('change', function() {
      $('#salary-median').html("Median Salary " + this.value);
    });
  };

  //Retrieves City Data from Teleport API and displays it to the Index view.
  let buildDetails = (data) => {
    //Overall Variables
    const cat = data.categories;

    console.log(cat[2]);
    console.log(cat[4]);
    console.log(cat[7]);
    console.log(cat[15]);
    console.log(cat[16]);

    //Housing Variables
    let smApt = parseFloat(data.categories[8].data[2].currency_dollar_value.toFixed(0));
    let medApt = parseFloat(data.categories[8].data[1].currency_dollar_value.toFixed(0));
    let lgApt = parseFloat(data.categories[8].data[0].currency_dollar_value.toFixed(0));

    //Cost Of Living Variables
    let coffeeCost = parseFloat(cat[3].data[3].currency_dollar_value.toFixed(2));
    let fitnessCost = parseFloat(cat[3].data[5].currency_dollar_value.toFixed(2));
    let beerCost = parseFloat(cat[3].data[6].currency_dollar_value.toFixed(2));
    let mealCost = parseFloat(cat[3].data[8].currency_dollar_value.toFixed(2));
    let cinemaCost = parseFloat(cat[3].data[4].currency_dollar_value.toFixed(2));
    let pubTransCost = parseFloat(cat[3].data[7].currency_dollar_value.toFixed(2));

    //Monthly and Daily Living Cost Estimators
    //TODO Add The calculations that went into daily/monthly cost to extra info tab.
    const monthlyLiving = '$' + ((fitnessCost + pubTransCost + medApt) + (beerCost * 32) + (cinemaCost * 2) + ((coffeeCost + mealCost) * 15)).toFixed(0);
    const dailyliving = '$' + (coffeeCost + mealCost + (pubTransCost / 30)).toFixed(0);

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

    //Weather Variables (all extras)
    let avgRainy = cat[2].data[2].float_value;
    let climate = cat[2].data[7].string_value;
    let dayLength = cat[2].data[0].float_value;
    let avgLowTemp = (parseFloat(cat[2].data[5].string_value) * 9 / 5 + 32);
    let avgHighTemp = (parseFloat(cat[2].data[4].string_value) * 9 / 5 + 32);

    //Culture Variables
    let artGalScore = parseFloat(cat[4].data[0].float_value);
    let cinemaScore = parseFloat(cat[4].data[2].float_value);
    let comedyScore = parseFloat(cat[4].data[4].float_value);
    let concertScore = parseFloat(cat[4].data[6].float_value);
    let historyScore = parseFloat(cat[4].data[8].float_value);
    let museumScore = parseFloat(cat[4].data[10].float_value);
    let perfArtScore = parseFloat(cat[4].data[12].float_value);
    let sportsScore = parseFloat(cat[4].data[14].float_value);
    let zooScore = parseFloat(cat[4].data[16].float_value);

    //Calculate an average of the Culture Score for basic information:
    const cultureScoreArray = [artGalScore, cinemaScore, comedyScore, concertScore, historyScore, museumScore, perfArtScore, sportsScore, zooScore];

      let cultScoreSum;
      let cultAvg;
      cultureScoreArray.forEach((val) => {
        cultScoreSum = this.sum += val;
      });
      cultAvg = (cultScoreSum/cultureScoreArray.length);

    let artGalCnt = parseInt(cat[4].data[1].int_value);
    let cinemaCnt = parseInt(cat[4].data[3].int_value);
    let comedyCnt = parseInt(cat[4].data[5].int_value);
    let concertCnt = parseInt(cat[4].data[7].int_value);
    let historyCnt = parseInt(cat[4].data[9].int_value);
    let museumCnt = parseInt(cat[4].data[11].int_value);
    let perfArtCnt = parseInt(cat[4].data[13].int_value);
    let sportsCnt = parseInt(cat[4].data[15].int_value);
    let zooCnt = parseInt(cat[4].data[17].int_value);

    cardContainer.append(`
      <div class="colored-tile">
        <spanclass="intro-title">Apartment Rentals</span>
      </div>
      <div id="apartment-img" class="section">
        <div class="info-card">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
          <span>Large Apartment: $${lgApt}</span>
          <span>Medium Apartment: $${medApt}</span>
          <span>Small Apartment: $${smApt}</span>
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <spanclass="intro-title">Average Cost of Living</span>
      </div>
      <div id="living-cost-img" class="section">
        <div class="info-card">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
          <span>Daily Average: ${dailyliving}</span>
          <span>Monthly Average: ${monthlyLiving}</span>
        </div>
        <div class="extra-info">
          <img class="info-card-img" src="${coffeeImg}" alt="coffee">$${coffeeCost}
          <img class="info-card-img" src="${fitnessImg}" alt="fitness">$${fitnessCost}
          <img class="info-card-img" src="${mealImg}" alt="meal">$${mealCost}
          <img class="info-card-img" src="${cinemaImg}" alt="cinema"><span>$${cinemaCost}</span>
        </div>
      </div>
    `);
    cardContainer.append(`
      <div class="colored-tile">
        <span class="intro-title">Startups</span>
      </div>
      <div id="startup-img" class="section">
        <div class="info-card">
          <img class="info-card-img" src="${startupImg}" alt="coffee">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
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
    //TODO Find and fill out this info
    cardContainer.append(`
      <div class="colored-tile">
        <span>Culture</span>
      </div>
      <div id="culture-img" class="section">
        <div class="info-card">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
          <span class="intro-title">Culture Score</span>
          <span>${cultAvg}</span>
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
    //TODO Find and fill out this info
    cardContainer.append(`
      <div class="colored-tile">
        <span>Weather</span>
      </div>
      <div id="weather-img" class="section">
        <div class="info-card">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
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
    //TODO Find and fill out this info
    cardContainer.append(`
      <div class="colored-tile">
        <span>Safety</span>
      </div>
      <div id="safety-img" class="section">
        <div class="info-card">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
    //TODO Find and fill out this info
    cardContainer.append(`
      <div class="colored-tile">
        <span>Pollution</span>
      </div>
      <div id="safety-img" class="section">
        <div class="info-card">
          <a class="expand-btn">
            <img class="expand-img" src="${expandImg}" alt="expand">
          </a>
        </div>
        <div class="extra-info">
          
        </div>
      </div>
    `);
    // console.log(data.categories);
    $('.expand-btn').on('click', function() {
      console.log('you clicked the expand button');
      $(this).parent().next().slideToggle(300);
    });
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

  //=================CLICKING AND KEYSTROKES FUNCTIONS==================
  //Clicking the "Go" button or pressing the "Enter" key will clear current info and request new info.
  const divClear = () => {
    cardContainer.html('');
  };

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