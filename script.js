let lat = 0;
let long = 0;
var temp = null;
var weatherScore = null;
var fancyScore = null;

function choose() {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("outfitChoice_display").style.display = "block";
    // getCurrentWeather();
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position)
{
  // Finding current location
  lat = position.coords.latitude;
  long = position.coords.longitude;
  let selectedLocation = [long, lat];
}

function getCurrentWeather()
{
  // Get weather from BOM api
  if (!isNaN(long) && !isNaN(lat) && lat!=0 && long!=0)
  {
    let weatherResults = [];
    let data = {
      exclude: "minutely,hourly",
      units: "si",
      callback: "weatherResponse"
    };

     jsonpRequest("https://api.darksky.net/forecast/5c15e00c26e7b9fe062688998c97d809/"+ String(lat) + "," + String(long), data)
  }
  else
  {
    alert("invalid coordinates");
  }
  // Sets reachable point scores for different max daily temperatures.
  if (temp <= 15)
  {
    weatherScore = 6;
  }
  if (temp > 15 && temp <= 20)
  {
    weatherScore = 4;
  }
  if (temp > 20 && temp <= 25)
  {
    weatherScore = 3;
  }
  if (temp > 25)
  {
    weatherScore = 2;
  }

  fancyScore = document.getElementById("fancy").value;

  clothingSelect();
}

function jsonpRequest(url, data) {
    
    // Build URL parameters from data object.
    let params = "";
    // For each key in data object...
    for (let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            if (params.length == 0)
            {
                // First parameter starts with '?'
                params += "?";
            }
            else
            {
                // Subsequent parameter separated by '&'
                params += "&";
            }

            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(data[key]);

            params += encodedKey + "=" + encodedValue;
         }
    }
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

function weatherResponse(weatherArray) {
    temp = weatherArray.daily.data[0].temperatureHigh;
}

function displayImage(imageId) {
  var img = document.createElement("img");

  img.src = "./jpgImages/_("+imageId+").jpg";
  img.style="width:300px";
  var src = document.getElementById("dispImage");

  src.appendChild(img);
}
  // Main selector section.
  // Create set of clothing items of correct fanciness.
function clothingSelect() {
  weatherScore = 3;
  var validFancyItems = [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].fancy == fancyScore) {
      validFancyItems.push(items[i]);
    }
  }
  // valid sets according to fanciness.
  var validTops = [];
  var validBottoms = [];
  var validJumpers = [];
  var validJackets = [];
  for (var j = 0; j < validFancyItems.length; j++) {
    if (validFancyItems[j].type == "top") {
      validTops.push(validFancyItems[j]);
    }
    // Chooses skirts and shorts for weather score of 2, chooses pants for higher weather scores.
    else if ((weatherScore <= 2) && (validFancyItems[j].type == "skirt" || validFancyItems[j].type == "shorts")) {
      validBottoms.push(validFancyItems[j]);
    }
    else if ((weatherScore > 2) && (validFancyItems[j].type == "pants")) {
      validBottoms.push(validFancyItems[j]);
    }  
    else if (validFancyItems[j].type == "jumper") {
      validJumpers.push(validFancyItems[j]);
    }
    else if (validFancyItems[j].type == "jacket") {
      validJackets.push(validFancyItems[j]);
    }
  }
  // Selects a top and bottom at random. Adds their warmth ratings.
  var selectedTop = validTops[Math.floor(Math.random()*validTops.length)];
  var selectedBottom = validBottoms[Math.floor(Math.random()*validBottoms.length)];
  var sumWarmthItems = selectedTop.warmth + selectedBottom.warmth;

  if (sumWarmthItems < weatherScore) {
  // separate jackets and jumpers, so one type is randomly selected, then an item from that type is selected.
  var validOuters = [validJumpers, validJackets];
  var selectedWarmOuter;

  // Checks if a randomly chosen outer garment will satisfy weatherScore.
  var selectedOuterType = validOuters[Math.floor(Math.random()*validOuters.length)];
  for (var i = 0; i < selectedOuterType.length; i++) {
    if (sumWarmthItems + selectedOuterType[i].warmth >= weatherScore) {
      selectedWarmOuter[i] = selectedOuterType[i];
    }
  }
  // Ensures there are outer garments which satisfy weatherScore conditions, if no single item works, it will combine a jacket with a jumper.
  if (selectedWarmOuter == [] || selectedWarmOuter == undefined) {
    if (selectedOuterType.type == "jacket") {
    for (var i = 0; i < validJumpers.length; i++) {
      if (sumWarmthItems + validJumpers[i].warmth >= weatherScore) {
        selectedWarmOuter[i] = validJumpers[i];
      }
    }
    }
    else {
    for (var i = 0; i < validJackets.length; i++) {
      if (sumWarmthItems + validJackets[i].warmth >= weatherScore) {
        selectedWarmOuter[i] = validJackets[i];
      }
    }
    }
  } 
  // Add jackets and jumpers together if there's no single outer garment that is warm enough.
  var validJacketJumpers = [];       // 2D array to store valid jacket and jumper pairs
  var arrayCounter=0;
  var selectedJacketJumperPair;
  if (selectedWarmOuter == [] || selectedWarmOuter == undefined) {
    for (var i = 0; i < validJackets.length; i++) {
      for (var j = 0; j < validJumpers.length; j++) {
        if (validJackets[i].warmth+validJumpers[j].warmth+sumWarmthItems >= weatherScore) {
          validJacketJumpers[arrayCounter] = [validJackets[i], validJumpers[j]];
          arrayCounter++;
        }
      }
    }
    if (validJacketJumpers == [] || validJacketJumpers == undefined) {
      // Go shopping
    }
    else {
    selectedJacketJumperPair = validJacketJumpers[Math.floor(Math.random()*validJacketJumpers.length)];
    }
  }
  var selectedSingleOuter;

  // We found a valid jacket or jumper
  // Valid items = selectedWarmOuter
  // randomly select from this set 
  if (selectedWarmOuter != [] && selectedWarmOuter != undefined) {
    selectedSingleOuter = selectedWarmOuter[Math.floor(Math.random()*selectedWarmOuter.length)];
  }
}

  displayImage(selectedTop.imageId);
  displayImage(selectedBottom.imageId);
  // displayImage(selectedSingleOuter.imageId);
  displayImage(selectedJacketJumperPair[0].imageId);
  displayImage(selectedJacketJumperPair[1].imageId);

  console.log(selectedTop);
  console.log(selectedBottom);
  console.log(selectedSingleOuter);
  console.log(selectedJacketJumperPair);
}