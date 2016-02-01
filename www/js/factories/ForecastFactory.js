// Factory that returns the forecast in the form of a single object
app.factory('ForecastFactory', function($ionicLoading, ApiCallFactory,
    UnitsFactory, InvertUnitsFactory) {
    var forecast = {};
    var kmh = UnitsFactory.getSpeedUnit();
    var celsius = UnitsFactory.getTempUnit();

    $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
    });

    ApiCallFactory.then(function (response) {
        var data = response.data;
        console.log(data);

        //today
        forecast.today = {
            day: data.daily.data[0].time * 1000,
            state: normalizeState(data.currently.icon, true),
            high: Math.round(data.daily.data[0].temperatureMax),
            low: Math.round(data.daily.data[0].temperatureMin),
            precipitation: Math.round(data.daily.data[0].precipProbability * 100),
            humidity: Math.round(data.daily.data[0].humidity * 100),
            feelsLike: Math.round(data.currently.apparentTemperature),
            windSpeed: Math.round(data.currently.windSpeed)
        };

        //If the unit saved is km/h, convert windSpeed to km/h
        if(kmh) {
            forecast.today.windSpeed = InvertUnitsFactory.invertSpeedUnit(forecast.today.windSpeed);
        }
        //If the unit saved is celsius, convert all temperatures to celsius
        if(celsius) {
            forecast.today.high = InvertUnitsFactory.invertTempUnit(forecast.today.high);
            forecast.today.low = InvertUnitsFactory.invertTempUnit(forecast.today.low);
            forecast.today.feelsLike = InvertUnitsFactory.invertTempUnit(forecast.today.feelsLike);
        }

        //week
        forecast.week = new Array();

        for (var i = 1; i < 7; i++) {
            forecast.week.push({
                day: data.daily.data[i].time * 1000,
                state: normalizeState(data.daily.data[i].icon, false),
                high: Math.round(data.daily.data[i].temperatureMax),
                low: Math.round(data.daily.data[i].temperatureMin),
                precipitation: Math.round(data.daily.data[i].precipProbability * 100),
                humidity: Math.round(data.daily.data[i].humidity * 100),
                windSpeed: Math.round(data.daily.data[i].windSpeed)
            });

            //If the unit saved is km/h, convert windSpeed to km/h
            if(kmh) {
                forecast.week[i-1].windSpeed = InvertUnitsFactory.invertSpeedUnit(forecast.week[i-1].windSpeed);
            }
            //If the unit saved is celsius, convert all temperatures to celsius
            if(celsius) {
                forecast.week[i-1].high = InvertUnitsFactory.invertTempUnit(forecast.week[i-1].high);
                forecast.week[i-1].low = InvertUnitsFactory.invertTempUnit(forecast.week[i-1].low);
            }
        };

        $ionicLoading.hide();
    }, function(error) {
        console.log(error);
        $ionicLoading.hide();
    });

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

    return forecast;
});
