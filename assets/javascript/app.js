  // Global variables
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  //var to store the number of checkboxes that can be checked
  var limit = 3;
  //count var keeps track of the current index of the restaurants array
  var count = 0;
  //var to store setTimeout function
  var looper;
  //var to hold current latitude, passed to Google API
  var lat;
  //var to hold current longitude, passed to Google API
  var lon;
  //empty array to hold food genres the user checks
  var genres = [];
  //empty array to hold responses from Google api
  var restaurants = [];
  // empty array to hold happiness scores
  var hapArr = [];
  // undefined var to hold the restaurant to go to
  var theChosen;
  var data;

  // Block to only allow three checked boxes
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  // event handler to ensure the user can only click up to the var limit of checkboxes
  $('.form-check-input').on('change', function(evt) {
     if($(this).siblings(':checked').length >= limit) {
        this.checked = false;
     }
  });

  // Firebase globals block
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  var config = {
    apiKey: "AIzaSyCl0vPiiyIf8kF4A6muwK__AwXRkLupi-U",
    authDomain: "dinner-picker-4be13.firebaseapp.com",
    databaseURL: "https://dinner-picker-4be13.firebaseio.com",
    projectId: "dinner-picker-4be13",
    storageBucket: "",
    messagingSenderId: "767642575660"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
  var consRef = db.ref("/connections");
  var conInfo = db.ref(".info/connected");

  //Geo-location block to retrieve current latitude and longitude
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getPosition()
    .then((position) => {
      console.log(position);
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    })
    .catch((err) => {
      console.error(err.message);
    });

  //Retrieve and store checked values
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  //Event handler for when the user clicks the submit button
  $('#submit').on('click', function(event) {
    event.preventDefault();
    //all user checked food genres are pushed to the genres array
    $('input:checkbox[type="checkbox"]:checked').each(function(){
      genres.push($(this).val());
    });

    //for loop to call the Google API for each food genre selected by the user
    for (var i = 0; i < genres.length; i++) {
      var url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
      var api = "AIzaSyCrSZtxM-JFlEyqajAam7VuztNLoXi3DPc";
      var q = genres[i];
      url += '?' + $.param({
        'key': api,
        'query': q + '+Restaurant',
        'location': lat + ',' + lon
      });

      $.ajax({
        url: url,
        method: 'GET'
      }).done(function(response) {
        for (var j = 0; j < 3; j++) {
          restaurants.push(response.results[j].name);
        }
      });
    }
    //remove the checkboxes
    $('#first-content-wrapper').empty();
    //launch the webcam
    Webcam.attach('#my_camera');
    //add a start button
    var btn = $('<button id="go">');
    btn.html("Start");
    $('#my_camera').append(btn);
    console.log(restaurants);
  });

  //App logic block
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  //event handler for clicking the start button
  $(document).on('click', '#go', checkCount);

  //function to check if all of the restaurants have been presented to the user
  function checkCount() {
    if (count == restaurants.length) {
      end();
    } else {
      runCamera();
    }
  }

  //function to call webcam.js snap picture function inside a setTimeout method
  function runCamera() {
    $('#restaurants').html(restaurants[count]);
    count++;
    looper = setTimeout(function() {
      Webcam.snap(function(data_uri) {
        //$('#base64image').attr("src", data_uri);
        data = data_uri;
        saveSnap();
      });
    }, 3000);
  }

  //function to stop the camera and present user with the restaurant they should eat at
  function end() {
    Webcam.reset();
    $('#app-area').empty();
    var maxIndex = hapArr.indexOf(Math.max.apply(null, hapArr));
    theChosen = restaurants[maxIndex];
    $('#result').html(theChosen);
  }

  //Code below is open-source and credited to this Github repo: https://github.com/vlasov01/emotion
  //-----------------------------------------------------------------------------------------------------------------------------
  //
  function saveSnap() {
    clearTimeout(looper);
    //var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
    var file = data.substring(23).replace(' ', '+');
    var img = Base64Binary.decodeArrayBuffer(file);
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", function(event) {
      uploadcomplete(event);
    }, false);
    ajax.open("POST", "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?", "image/jpg");
    ajax.setRequestHeader("Content-Type", "application/octet-stream");
    //ajax.setRequestHeader("Accept-Encoding","gzip, deflate");
    ajax.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml");
    ajax.setRequestHeader("Ocp-Apim-Subscription-Key", "a56af77ea8264c04bfa6d55cae572d61");
    ajax.send(img);
  }

  function uploadcomplete(event) {
    var xmlDoc = event.target.responseXML;
    var list = xmlDoc.getElementsByTagName("scores");
    console.log(list[0].childNodes[4].textContent);
    var hapScore = Number(list[0].childNodes[4].textContent);
    hapScore.toFixed(20);
    console.log(hapScore);
    hapArr.push(hapScore);
    console.log(hapArr);
    checkCount();
    // document.getElementById("anger").innerHTML = list[0].childNodes[0].textContent;
    // document.getElementById("contempt").innerHTML = list[0].childNodes[1].textContent;
    // document.getElementById("disgust").innerHTML = list[0].childNodes[2].textContent;
    // document.getElementById("fear").innerHTML = list[0].childNodes[3].textContent;
    // document.getElementById("happiness").innerHTML = list[0].childNodes[4].textContent;
    // document.getElementById("neutral").innerHTML = list[0].childNodes[5].textContent;
    // document.getElementById("sadness").innerHTML = list[0].childNodes[6].textContent;
    // document.getElementById("surprise").innerHTML = list[0].childNodes[7].textContent;
  }
