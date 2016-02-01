// Service that returns a promise for an http call to the Dark Sky Forecast API
app.factory('ApiCallFactory', function($http, FORECASTIO_KEY) {
    var latitude  = 42.589611;
	var longitude = -70.819806;
    var url = 'https://api.forecast.io/forecast/' +
        FORECASTIO_KEY + '/' + latitude + ',' + longitude;

    return $http.jsonp(url + '?callback=JSON_CALLBACK');
});
