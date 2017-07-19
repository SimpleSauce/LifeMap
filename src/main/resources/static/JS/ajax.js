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
  const startupImg = './img/005-team.svg';
  const cinemaImg = './img/002-theater.svg';
  const weatherImg = './img/010-cloud.svg';
  const healthImg = './img/005-hospital.svg';
  const businessImg = './img/004-manager.svg';
  const cultureImg = './img/008-transport.svg';
  const toleranceImg = './img/003-gays.svg';
  const outdoorsImg = './img/002-tree.svg';
  const aptImg = './img/009-real-estate.svg';
  const jobMarketImg = './img/006-store.svg';
  const transImg = './img/001-bus.svg';
  const costOfLiving = './img/001-budget.svg';
  const cleanlinessImg = './img/007-eolic.svg';
  const salaryImg = './img/004-salary.svg';
  const pollutionImg = './img/001-factory.svg';
  const cardContainer = $('#info-card-container');
  const iconContainer = $('#icon-container');
  let locationDisplay = $('#location-info');
  let locationHeader = $('#location-name');
  let avg;
  let info = $('.info');

  const sanAntonioLocation = {lat: 29, lng: -98};
  let markersArray = [];
  const map = new google.maps.Map(document.getElementById('map'), {
    center: sanAntonioLocation,
    zoom: 7
  });

  //========================GOOGLE API METHODS========================
  let autocomplete = new google.maps.places.Autocomplete(document.getElementById('city-input'));
  autocomplete.bindTo('bounds', map);

  //Takes input from the search bar and sends it to the getLocationInfo() method. Also re-centers the map onto the location specified.
  const geoCoder = () => {
    //TODO Make this look prettier and function better
    geoCodeIt.geocode({'address': cityInput.val()},
      (results, status) => {
        if(status =='OK') {
          map.setCenter(results[0].geometry.location);
          addLocationMarker(results[0].geometry.location, map);
          console.log(results);
          //Calls these two methods and passes the City Name (which Teleport API is set up to use).
          getLocationInfo(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          requestWeather(results[0].geometry.location.lat, results[0].geometry.location.lng);
        } else {
          console.log("Geocode wasn't successful for reason: " + status);
        }
    });
  };

  const addLocationMarker = (location, map) => {
    clearMarker();
    let marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markersArray.push(marker);
  };

  const clearMarker = () => {
    setMapOnAll(null);
    markersArray = [];
  };

  const setMapOnAll = (map) => {
    for (let i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(map);
    }
  };

  //===================TELEPORT API AJAX REQUEST/BUILD===================
  const getLocationInfo = (lat, lon) => {
    console.log(lat, lon);
    $.ajax({
        url: "https://api.teleport.org/api/locations/" + lat + ", " +  lon + "/",
        type: "GET",
    }).done((data) => {
      console.log('Overall Location Data: ', data);
        buildLocationInfo(data);
        $.ajax({
        url: data._embedded['location:nearest-urban-areas'][0]._links['location:nearest-urban-area'].href,
        type: "GET"
    }).done((data) => {
        buildUrbanInfo(data);
          console.log('Urban Area Info: ', data);
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
        }).done(data => {
          requestWeather(lat, lon, data);
        });
      });
    });
  };

  const requestWeather = (lat, lng, data) => {
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?",
      data: {
        APPID: openMapsKey,
        units: "imperial",
        lat: lat,
        lon: lng
      }
    }).done((weather) => {
      buildDetails(data, weather.main.temp.toFixed(0));
    });
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

  //TODO Make this function fade-in icons.
  const iconDisplay = (img) => {
    iconContainer.html(`
      <a id='center' class="icon" >
        <img id="happiness-img" src="${img}" title="Happiness" alt="icon">
      </a>
      <a id='deg0' class="icon" >
        <img id="apt-img" src="${aptImg}" title="Rental Cost" alt="icon">
      </a>
      <a id='deg27692' class="icon" >
        <img id="living-cost-img" src="${costOfLiving}" title="Cost Of Living" alt="icon">
      </a>
      <a id='deg55384' class="icon" >
        <img id="startup-img" src="${startupImg}" title="Startups" alt="icon">
      </a>
      <a id='deg83076' class="icon" >
        <img id="culture-img" src="${cultureImg}" title="Culture" alt="icon">
      </a>
      <a id='deg11076' class="icon" >
        <img id="weather-img" src="${weatherImg}" title="Weather" alt="icon">
      </a>
      <a id='deg13846' class="icon" >
        <img id="clean-img" src="${cleanlinessImg}" title="Cleanliness" alt="icon">
      </a>
      <a id='deg16615' class="icon" >
        <img id="salary-img" src="${salaryImg}" title="Salaries by Industry" alt="icon">
      </a>
      <a id='deg19384' class="icon" >
        <img src="${businessImg}" title="Businesses" alt="icon">
      </a>
      <a id='deg22153' class="icon" >
        <img src="${healthImg}" title="Health" alt="icon">
      </a>
      <a id='deg24923' class="icon" >
        <img src="${jobMarketImg}" title="Job Market" alt="icon">
      </a>
      <a id='deg276-92' class="icon" >
        <img src="${toleranceImg}" title="LGBT Tolerance" alt="icon">
      </a>
      <a id='deg30461' class="icon" >
        <img src="${outdoorsImg}" title="Outdoors" alt="icon">
      </a>      
    `);
  };

  //Takes 17 metrics (provided by Teleport API), and averages them all to produce a single metric.
  let buildScoreInfo = (data) => {
    const scoreArray = [];
    const catArray = [];
    const scoreAndCat = [];
    let sum = 0;
    locationDisplay.html(data.summary);
    data.categories.forEach((val) => {
      scoreArray.push(val.score_out_of_10);
      catArray.push(val.name);
    });
    scoreArray.forEach((val) => {
      sum += val;
    });

    avg = (sum / 17).toFixed(1);
    console.log(catArray);
    for (let i = 0; i < scoreArray.length; i++) {
      scoreAndCat.push(catArray[i] + ": " + scoreArray[i].toFixed(1));
    }

    if (user == "") {
      $('#happiness').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${happyImg}" alt="icon">
          <span>Average Happiness</span> 
        </div>
        <div class="info-div">${avg}/10</div>
      `);
    } else {
      $('#happiness').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${happyImg}" alt="icon">
          <span>Average Happiness</span> 
        </div>
        <div class="info-div">${avg}/10</div>
      `);
      scoreAndCat.forEach((val) => {
        $('#happiness').append(`
          <div class="info-div">
            <span class="info-span">${val}</span>
          </div>
        `);
      });
    }

    if (avg >= 5) {
      iconDisplay(happyImg);
    }
    else {
      iconDisplay(sadImg);
    }
  };

  let locationImageDisplay = (data) => {
      $('#image-container').html(`<img id="location-image" src="${data.photos[0].image.web}" alt="picture"/>`);
  };

  let buildSalaryInfo = (data) => {
    console.log(data);

    let selectBox = '<option disabled="disabled" selected="selected">Choose an Industry</option>';

    //Each industry gets added as an option to be placed in select tag.
    //Each median salary gets displayed when its corresponding industry is selected.
    data.salaries.forEach((val) => {
      let salary = parseFloat(val.salary_percentiles.percentile_50).toFixed(0);
      selectBox += `<option class="industry-option" value="$${salary}">${val.job.title}</option>`;
    });

    let htmlString = `
      <div class="intro-title">
      <img class="info-card-img" src="${salaryImg}" alt="icon">
         <span> Average Salaries (by Industry)</span>
      </div>
      <div id="dropdown-container">
        <select id="job-dropdown" name="industry-dropdown">
          ${selectBox}
        </select>
        <div class="info-div">
          <span id="salary-median"></span>
        </div>
      </div>`;
      $('#salary').append(htmlString);

    //Add Click functionality to change salary that appears based on selection.
    $('#job-dropdown').on('change', function() {
      $('#salary-median').html(`<span class="info-span">Median Salary: ` + this.value + "</span>");
    });
  };

  //Receives City Data from Teleport API and displays it to the Index view.
  let buildDetails = (data, currentTemp) => {
    console.log(data);
    console.log(currentTemp);
    //Overall Variables
    const cat = data.categories;
    console.log(cat[0]);
    console.log(cat[1]);
    console.log(cat[7]);
    console.log(cat[10]);
    console.log(cat[12]);
    console.log(cat[14]);

    //Housing Variables
    let smApt = parseFloat(data.categories[8].data[2].currency_dollar_value.toFixed(0));
    let medApt = parseFloat(data.categories[8].data[1].currency_dollar_value.toFixed(0));
    let lgApt = parseFloat(data.categories[8].data[0].currency_dollar_value.toFixed(0));

    //Cost Of Living Variables
    let coffeeCost = parseFloat(cat[3].data[3].currency_dollar_value.toFixed(3));
    let fitnessCost = parseFloat(cat[3].data[5].currency_dollar_value.toFixed(2));
    let beerCost = parseFloat(cat[3].data[6].currency_dollar_value.toFixed(2));
    let mealCost = parseFloat(cat[3].data[8].currency_dollar_value.toFixed(2));
    let cinemaCost = parseFloat(cat[3].data[4].currency_dollar_value.toFixed(2));
    let pubTransCost = parseFloat(cat[3].data[7].currency_dollar_value.toFixed(2));

    //Monthly and Daily Living Cost Estimators
    const monthlyLiving = '$' + ((fitnessCost + pubTransCost + medApt) + (beerCost * 32) + (cinemaCost * 2) + ((coffeeCost + mealCost) * 15)).toFixed(0);
    const dailyliving = '$' + (coffeeCost + mealCost + (pubTransCost / 30)).toFixed(0);

    //Startup Variables
    let avgStartupScore = cat[17].data[12].float_value;
    let avgStartupIncrease = cat[17].data[11].float_value;
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

    let artGalCnt = parseInt(cat[4].data[1].int_value);
    let cinemaCnt = parseInt(cat[4].data[3].int_value);
    let comedyCnt = parseInt(cat[4].data[5].int_value);
    let concertCnt = parseInt(cat[4].data[7].int_value);
    let historyCnt = parseInt(cat[4].data[9].int_value);
    let museumCnt = parseInt(cat[4].data[11].int_value);
    let perfArtCnt = parseInt(cat[4].data[13].int_value);
    let sportsCnt = parseInt(cat[4].data[15].int_value);
    let zooCnt = parseInt(cat[4].data[17].int_value);

    let artGalCat = cat[4].data[1].label;
    let cinemaCat = cat[4].data[3].label;
    let comedyCat = cat[4].data[5].label;
    let concertCat = cat[4].data[7].label;
    let historyCat = cat[4].data[9].label;
    let museumCat = cat[4].data[11].label;
    let perfArtCat = cat[4].data[13].label;
    let sportsCat = cat[4].data[15].label;
    let zooCat = cat[4].data[17].label;

    //Cleanliness Variables
    let pollutionScore = cat[15].data[0].float_value;
    let cleanScore = cat[15].data[1].float_value;
    let waterScore = cat[15].data[2].float_value;
    let greeneryScore = cat[15].data[3].float_value;

    //Business Freedom variables
    let businessFreedom = parseFloat(cat[0].data[0].float_value);
    let busiFreedomScore = parseFloat(cat[0].data[1].float_value);
    let corruptionFreedom = parseFloat(cat[0].data[2].float_value);
    let corrFreedomScore = parseFloat(cat[0].data[3].float_value);
    let lackLaborRestrict = parseFloat(cat[0].data[4].float_value);
    let lackLaborRestScore = parseFloat(cat[0].data[5].float_value);
    let businessOpenTime = parseFloat(cat[0].data[6].float_value);
    let busiOpenTimeScore = parseFloat(cat[0].data[7].float_value);

    //Health Care Variables
    let healthCostScore = parseFloat(cat[7].data[0].float_value);
    let lifeExpect = parseFloat(cat[7].data[1].float_value);
    let lifeExpectScore = parseFloat(cat[7].data[2].float_value);
    let healthQualScore = parseFloat(cat[7].data[3].float_value);

    let population = parseFloat(cat[1].data[0].float_value);

    //Job Market Variables
    let maxSsToEmployee = parseFloat(cat[10].data[0].currency_dollar_value.toFixed(2));
    let maxSsToEmpLabel = cat[10].data[0].label;
    let employeeSsTaxRate = parseFloat(cat[10].data[2].percent_value.toFixed(1));
    let empSsTaxRateLabel = cat[10].data[2].label;
    let availStartupJobs = cat[10].data[3].int_value;
    let availStartJobLabel = cat[10].data[3].label;
    let availStartJobScore = parseFloat(cat[10].data[4].float_value);
    let startupSalaryScore = parseFloat(cat[10].data[5].float_value);
    let avgStartupSalary = parseFloat(cat[10].data[6].currency_dollar_value.toFixed(2));
    let avgStartSalLabel = cat[10].data[6].label;

    //Tolerance Variables
    let adoptRights = cat[12].data[0].string_value;
    let adoptRightsLabel = cat[12].data[0].label;
    let discrimination = cat[12].data[4].string_value;
    let discrimLabel = cat[12].data[4].label;
    let homoRights = cat[12].data[7].string_value;
    let homoRightsLabel = cat[12].data[7].label;
    let marriageRights = cat[12].data[9].string_value;
    let marryRightsLabel = cat[12].data[9].label;
    let equalityIndex = parseFloat(cat[12].data[10].float_value);
    let equalIndexLabel = cat[12].data[10].label;
    let equalIndexScore = parseFloat(cat[12].data[11].float_value);

    //Outdoors Variables
    let elevation = parseFloat(cat[14].data[0].float_value);
    let hillyScore = parseFloat(cat[14].data[3].float_value);

    const cleanAvg = (((pollutionScore + cleanScore + waterScore + greeneryScore)/4) * 10);

    //Calculate an average of the Culture Score for basic information:
    const cultureScoreArray = [artGalScore, cinemaScore, comedyScore, concertScore, historyScore, museumScore, perfArtScore, sportsScore, zooScore];
    const cultureCntArray = [artGalCnt, cinemaCnt, comedyCnt, concertCnt, historyCnt, museumCnt, perfArtCnt, sportsCnt, zooCnt];
    const cultureCatArray = [artGalCat, cinemaCat, comedyCat, concertCat, historyCat, museumCat, perfArtCat, sportsCat, zooCat];
    const cultureCatAndCnt = [];

      let cultScoreSum = 0;
      let cultAvg;
      cultureScoreArray.forEach((val) => {
        cultScoreSum += val;
      });
      cultAvg = ((cultScoreSum/cultureScoreArray.length) * 10).toFixed(0);

      for(let i = 0; i<cultureScoreArray.length; i++) {
        cultureCatAndCnt.push(cultureCatArray[i] + ": " + cultureCntArray[i]);
      }

    $('#apartment').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${aptImg}" alt="icon">
        <span>Apartment Rentals</span>
      </div>
      <div class="info-div">
        <span class="info-span">Large Apartment: $${lgApt}</span>
        <span class="info-span">Medium Apartment: $${medApt}</span>
        <span class="info-span">Small Apartment: $${smApt}</span>
      </div>
    `);

    if(user == "") {
      $('#cost-of-living').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${costOfLiving}" alt="icon">
        <span>Average Cost of Living</span>
      </div>
      <div class="info-div">
        <span class="info-span">Daily Average: ${dailyliving}</span>
        <span class="info-span">Monthly Average: ${monthlyLiving}</span>
      </div>
      `);
    } else {
      $('#cost-of-living').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${costOfLiving}" alt="icon">
          <span>Average Cost of Living</span>
        </div>
        <span class="info-span">Daily Average: ${dailyliving}</span>
        <span class="info-span">Monthly Average: ${monthlyLiving}</span>
        <div class="info-div">Monthly Average Calculation:
          <span class="info-span">
            <img class="cost-icon" src="${fitnessImg}" alt="fitness">Fitness Club Membership - $${(fitnessCost).toFixed(2)}
          </span>
          <span class="info-span">Public Transportation - $${(pubTransCost).toFixed(2)}</span>
          <span class="info-span">Medium Apartment - $${medApt}</span>
          <span class="info-span">32 Beers - $${(beerCost * 32).toFixed(2)}</span>
          <span class="info-span">2 Movies - $${(cinemaCost * 2).toFixed(2)}</span>
          <span class="info-span">Coffee and Lunch (every other day) - $${((coffeeCost + mealCost) * 15).toFixed(2)}</span>
        </div>
        <div class="info-div">Daily Average Calculation:
          <span class="info-span">Cost of Lunch - $${(mealCost).toFixed(2)}
            <img class="cost-icon" src="${mealImg}" alt="meal">
          </span>
          <span class="info-span">Daily Public Transportation - $${(pubTransCost / 30).toFixed(2)}
            <img class="cost-icon" src="${transImg}" alt="cinema">
          </span>
          <span class="info-span">Coffee - $${coffeeCost.toFixed(2)}
            <img class="cost-icon" src="${coffeeImg}" alt="coffee">
          </span>
        </div>
      `);
    }

    if(user == "") {
      $('#startups').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${startupImg}" alt="icon">
        <span>Startups</span>
      </div>
        <div class="info-div">
          <span class="info-span">Average Startup Score: ${avgStartupScore.toFixed(1)}/10</span>
          <span class="info-span">Average Startup Increase Score: ${avgStartupIncrease}/10</span>
          <span class="info-span">Startup Climate Investors: ${investors}</span>
          <span class="info-span">WorkFrom.Co Co-Working Spaces: ${workFromCoNum}</span>
        </div>
        `)
    } else {
      $('#startups').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${startupImg}" alt="icon">
          <span>Startups</span>
        </div>
        <div class="info-div">
          <span class="info-span">Average Startup Score: ${(avgStartupScore * 10).toFixed(1)}/10</span>
          <span class="info-span">Average Startup Increase Score: ${(avgStartupIncrease * 10).toFixed(1)}/10</span>
          <span class="info-span">Startup Climate Investors: ${investors}</span>
          <span class="info-span">WorkFrom.Co Co-Working Spaces: ${workFromCoNum}</span>
        </div>
        <div class="info-div">
          <span class="info-span">Co-Working Spaces Score: ${(coWorkScore * 10).toFixed(1)}/10</span>
          <span class="info-span">Startup Events Score: ${(eventsScore * 10).toFixed(1)}/10</span>
          <span class="info-span">Meetups Score: ${(meetupScore / 100).toFixed(1)}/10</span>
          <span class="info-span">Startup Events This Month: ${eventsCount}</span>
          <span class="info-span">Startup Events The Last 12 Months: ${eventsLstYr}</span>
          <span class="info-span">FunderBeam Total Startups: ${fundrBmStrtups}</span>
          <span class="info-span">Total Upcoming Meetups: ${meetupEvents}</span>
          <span class="info-span">Meetups Groups: ${meetupGroups}</span>
        </div>
      `);
    }

    //================CULTURE================

    if(user == "") {
      $('#culture').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${cultureImg}" alt="icon">
        <span>Culture</span>
      </div>
      <div class="info-div">
        <span class="info-span">${cultAvg}/10</span>
      </div>
    `);
    } else {
      $('#culture').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${cultureImg}" alt="icon">
          <span class="info-span">Culture</span>
        </div>
        <div class="info-div">
          <span class="info-span">${cultAvg}/10</span>
        </div>
        <div id="culture-extras" class="info-div"></div>
      `);
      cultureCatAndCnt.forEach((val) => {
        $('#culture-extras').append(`
        <span class="info-span">${val}</span>
        `);
      });
    }

    if(user == "") {
      $('#weather').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${weatherImg}" alt="icon">
        <span>Weather</span>
      </div>
      <div class="info-div">
        <span class="info-span">Current Temp: ${currentTemp}${degreeSymbol}</span>
      </div>
    `);
    } else {
      $('#weather').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${weatherImg}" alt="icon">
          <span>Weather</span>
        </div>
        <div class="info-div">
          <span class="info-span">Current Temp: ${currentTemp}${degreeSymbol}</span>
          <span id="averages-title">Averages</span>
          <span class="info-span">Day Length: ${dayLength}</span>
          <span class="info-span">High/Low Temps: ${(avgHighTemp).toFixed(0)}/${(avgLowTemp).toFixed(0)}</span>
          <span class="info-span">Rainy Days/Year: ${avgRainy}</span>
          <span class="info-span">Climate Type: ${climate}</span>
        </div>
      `);
    }

    if(user == "") {
      $('#cleanliness').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${cleanlinessImg}" alt="icon">
          <span>Cleanliness</span>
        </div>
        <div class="info-div">
          <span class="info-span">Overall Cleanliness Score: ${cleanAvg.toFixed(1)}/10</span>
        </div>
      `);
    } else {
      $('#cleanliness').html(`
        <div class="intro-title">
        <img class="info-card-img" src="${cleanlinessImg}" alt="icon">
          <span>Cleanliness</span>
        </div>
        <div class="info-div">
          <span class="info-span">Overall Cleanliness Score: ${cleanAvg.toFixed(1)}/10</span>
          <span class="info-span">Pollution Score: ${(pollutionScore * 10).toFixed(1)}/10</span>
          <span class="info-span">Cleanliness Score: ${(cleanScore * 10).toFixed(1)}/10</span>
          <span class="info-span">Water Quality Score: ${(waterScore * 10).toFixed(1)}/10</span>
          <span class="info-span">Urban Greenery Score: ${(greeneryScore * 10).toFixed(1)}/10</span>
        </div>
      `);
    }

    if(business == 'true') {
      $('#business-div').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${businessImg}" alt="icon">
        <span>Business</span>
      </div>
      <div class="info-div">
        <span class="info-span">Business Freedom: ${businessFreedom}%</span>
        <span class="info-span">Overall Business Freedom Score: ${(busiFreedomScore.toFixed(1) * 10)}/10</span>
        <span class="info-span">Freedom From Corruption: ${corruptionFreedom}%</span>
        <span class="info-span">Score: ${(corrFreedomScore.toFixed(1) * 10)}/10</span>
        <span class="info-span">Lack of Labor Restrictions: ${lackLaborRestrict}%</span>
        <span class="info-span">Score: ${(lackLaborRestScore * 10)}/10</span>
        <span class="info-span">Time To Open A Business Score: ${(busiOpenTimeScore.toFixed(1) * 10)}/10</span>
      </div>
    `);
    } else $('#business-div').html(`<div class="warning-div"><div class="text-div">Please log in or update your search preferences from your profile page to see this information!</div></div>`);

    if(healthCare == 'true') {
      $('#healthcare-div').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${healthImg}" alt="icon">
        <span>Health Care</span>
      </div>
      <div class="info-div">
        <span class="info-span">Overall Health Quality Score: ${(healthQualScore.toFixed(1) * 10)}/10</span>
        <span class="info-span">Cost of Health Care Score: ${(healthCostScore.toFixed(1) * 10)}/10</span>
        <span class="info-span">Average Life Expectancy (Years): ${lifeExpect.toFixed(0)}</span>
        <span class="info-span">Life Expectancy Score: ${(lifeExpectScore.toFixed(1) * 10)}/10</span>
      </div>
    `);
    } else $('#healthcare-div').html(`<div class="warning-div"><div class="text-div">Please log in or update your search preferences from your profile page to see this information!</div></div>`);

    if(jobMarket == 'true') {
      $('#jobmarket-div').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${jobMarketImg}" alt="icon">
        <span>Job Market</span>
      </div>
      <div class="info-div">
        <span class="info-span">${maxSsToEmpLabel}: $${maxSsToEmployee}</span>
        <span class="info-span">${empSsTaxRateLabel}: ${employeeSsTaxRate}%</span>
        <span class="info-span">${availStartJobLabel}: ${availStartupJobs}</span>
        <span class="info-span">Available Startup Jobs Score${(availStartJobScore * 10)}/10</span>
        <span class="info-span">${avgStartSalLabel}: $${avgStartupSalary}</span>
        <span class="info-span">Startup Salary Score: ${(startupSalaryScore * 10)}/10</span>
      </div>
    `);
    } else $('#jobmarket-div').html(`<div class="warning-div"><div class="text-div">Please log in or update your search preferences from your profile page to see this information!</div></div>`);

    if(tolerance == 'true') {
      $('#tolerance-div').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${toleranceImg}" alt="icon">
        <span>Minority/LGBT Tolerance</span>
      </div>
      <div class="info-div">
        <span class="info-span">${adoptRightsLabel}: ${adoptRights}</span>
        <span class="info-span">${discrimLabel}: ${discrimination}</span>
        <span class="info-span">${homoRightsLabel}: ${homoRights}</span>
        <span class="info-span">${marryRightsLabel}: ${marriageRights}</span>
        <span class="info-span">${equalIndexLabel}: ${equalityIndex.toFixed(1)}</span>
        <span class="info-span">Equality Index Score: ${(equalIndexScore.toFixed(1) * 10)}/10</span>
      </div>
    `);
    } else $('#tolerance-div').html(`<div class="warning-div"><div class="text-div">Please log in or update your search preferences from your profile page to see this information!</div></div>`);

    if(outdoors == 'true') {
      $('#outdoors-div').html(`
      <div class="intro-title">
      <img class="info-card-img" src="${outdoorsImg}" alt="icon">
        <span>Outdoors</span>
      </div>
      <div class="info-div">
        <span class="info-span">Elevation: ${elevation}</span>
        <span class="info-span">Hills/Mountains Average: ${(hillyScore.toFixed(1)) * 10} (Higher is more hilly</span>
      </div>
    `);
    } else $('#outdoors-div').html(`<div class="warning-div"><div class="text-div">Please log in or update your search preferences from your profile page to see this information!</div></div>`);

    $('.expand-btn').on('click', function() {
      console.log('you clicked the expand button');
      $(this).parent().next().slideToggle(300);
    });
    (user == "") ? console.log('theres no user!') : $('.expand-btn').removeClass('hidden');

    $('.icon').each(function (i, icon) {
      $(icon).click(function () {
        console.log('icon clicked');
        console.log(i);
        console.log(icon);
        console.log($(info[i]));
        $('.shown').toggleClass('hidden').toggleClass('shown');
        $(info[i]).toggleClass('hidden').toggleClass('shown');
      });
    });
  };

  //=================CLICKING AND KEYSTROKES FUNCTIONS==================
  //Clicking the "Go" button or pressing the "Enter" key will clear current info and request new info.
  goButton.on('click', () => {
    $('.shown').toggleClass('hidden').toggleClass('shown');
    geoCoder();
  });

  if(user == "") {
    //TODO If there's not a user, hovering over the exclusive icons will show message.
  }

  //TODO hamburger-wrapped side-bar for icon keys

  $(document).keyup((e) => {
    if (e.keyCode === 13) {
      $('.shown').toggleClass('hidden').toggleClass('shown');
      geoCoder();
    }
  });
})();