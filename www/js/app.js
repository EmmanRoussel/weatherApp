// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

var app = angular.module('weather', ['ionic']);

app.controller('WeatherCtrl', function($scope, $ionicSideMenuDelegate,
    apiCallFactory) {

    var weather = this;
    var data;
    var celsius = false;
    var kmh = false;
    var SPEED_UNIT_CONSTANT = 0.62137;

    apiCallFactory.then(function (response) {
        data = response.data;
        console.log(data);
        weather.today = {
            day: data.daily.data[0].time * 1000,
            state: normalizeState(data.currently.icon, true),
            high: Math.round(data.daily.data[0].temperatureMax),
            low: Math.round(data.daily.data[0].temperatureMin),
            precipitation: data.daily.data[0].precipProbability,
            humidity: data.daily.data[0].humidity,
            feelsLike: Math.round(data.currently.apparentTemperature),
            windSpeed: Math.round(data.currently.windSpeed)
        };

        weather.week = new Array();

        for (var i = 1; i < 7; i++) {
            weather.week.push({
                day: data.daily.data[i].time * 1000,
                state: normalizeState(data.daily.data[i].icon, false),
                high: Math.round(data.daily.data[i].temperatureMax),
                low: Math.round(data.daily.data[i].temperatureMin),
                precipitation: data.daily.data[i].precipProbability,
                humidity: data.daily.data[i].humidity,
                windSpeed: Math.round(data.daily.data[i].windSpeed)
            });
        };
    }, function(error) {
        console.log(error);
    });

    $scope.temperatureUnitList = [
        { text: "Fahrenheit", value: "f" },
        { text: "Celcius", value: "c" }
    ];

    $scope.speedUnitList = [
        { text: "Mph", value: "mph" },
        { text: "Km/h", value: "kmh" }
    ];

    $scope.data = {
        temperature: 'f',
        speed: 'mph'
    };

    weather.currentUnits = {
        temperature: 'F',
        speed: 'mph'
    };

    $scope.speedUnitChange = function(item) {
        kmh = !kmh;

        //today
        weather.today.windSpeed = invertSpeedUnit(weather.today.windSpeed);

        //week
        weather.week.forEach(function(day) {
            day.windSpeed = invertSpeedUnit(day.windSpeed);
        });

        //unit
        if(kmh) {
            weather.currentUnits.speed = 'km/h';
        }
        else {
            weather.currentUnits.speed = 'mph';
        }
    };

    $scope.temperatureUnitChange = function(item) {
        celsius = !celsius;

        //today
        weather.today.high = invertTempUnit(weather.today.high);
        weather.today.low = invertTempUnit(weather.today.low);
        weather.today.feelsLike = invertTempUnit(weather.today.feelsLike);

        //week
        weather.week.forEach(function(day) {
            day.high = invertTempUnit(day.high);
            day.low = invertTempUnit(day.low);
        });
    };

    /* Converts the state of a day to a known state if different */
    function normalizeState(state, today) {
        var newState = state;
        if(!today) {
            if(state == 'clear-night') {
                newState = 'clear-day';
            }
            else if (state == 'partly-cloudy-night') {
                newState = 'partly-cloudy-day';
            }
        }
        if (state == 'sleet') {
            newState = 'snow';
        }
        else if (state == 'wind' || state == 'fog') {
            newState = 'cloudy';
        }
        return newState;
    };

    /* Converts temperature from Celsius to Fahrenheit or
    from Fahrenheit to Celsius */
    function invertTempUnit(temp) {
        var newTemp;

        if(celsius) {
            newTemp = Math.round((temp - 32) * (5/9));
        }
        else {
            newTemp = Math.round((temp * 1.8) + 32);
        }
        return newTemp;
    };

    /* Converts speed from mph to km/h or from km/h to mph */
    function invertSpeedUnit(speed) {
        var newSpeed;

        if(kmh) {
            newTemp = Math.round(speed/SPEED_UNIT_CONSTANT);
        }
        else {
            newTemp = Math.round(speed * SPEED_UNIT_CONSTANT);
        }
        return newTemp;
    };
});

app.factory('apiCallFactory', function($http) {
    var latitude  = 42.589611;
	var longitude = -70.819806;
    var url = 'https://api.forecast.io/forecast/' +
        '48e00e942977ec92183d8e8dd86bcdc3/' + latitude + ',' + longitude;

    return $http.jsonp(url + '?callback=JSON_CALLBACK');
});
