// Service that returns a promise for an http call to the Dark Sky Forecast API
app.factory('ApiCallFactory', function($http) {
    var latitude  = 42.589611;
	var longitude = -70.819806;
    var url = 'https://api.forecast.io/forecast/' +
        '48e00e942977ec92183d8e8dd86bcdc3/' + latitude + ',' + longitude;

    return $http.jsonp(url + '?callback=JSON_CALLBACK');
});
