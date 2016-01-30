// Main Controller moved in different file suggested by Adam Vigneaux
app.controller('WeatherCtrl', function($scope, $ionicSideMenuDelegate,
    ForecastFactory, UnitsFactory, InvertUnitsFactory) {

    var weather = this;
    var initialSpeedUnit;
    var initialTempUnit;

    weather.forecast = ForecastFactory;

    $scope.temperatureUnitList = [
        { text: "Fahrenheit", value: "f" },
        { text: "Celcius", value: "c" }
    ];

    $scope.speedUnitList = [
        { text: "Mph", value: "mph" },
        { text: "Km/h", value: "km/h" }
    ];

    //Verify what units are used and set them accordingly in the $scope
    if(UnitsFactory.getSpeedUnit()) {
        initialSpeedUnit = 'km/h';
    }
    else {
        initialSpeedUnit = 'mph';
    }
    if(UnitsFactory.getTempUnit()) {
        initialTempUnit = 'c';
    }
    else {
        initialTempUnit = 'f';
    }
    $scope.data = {
        temperature: initialTempUnit,
        speed: initialSpeedUnit
    };
    weather.currentUnits = {
        temperature: initialTempUnit,
        speed: initialSpeedUnit
    };

    $scope.speedUnitChange = function(item) {
        kmh = !UnitsFactory.getSpeedUnit();

        //save
        UnitsFactory.saveSpeedUnit(kmh);

        //today
        weather.forecast.today.windSpeed = InvertUnitsFactory.invertSpeedUnit(weather.forecast.today.windSpeed);

        //week
        weather.forecast.week.forEach(function(day) {
            day.windSpeed = InvertUnitsFactory.invertSpeedUnit(day.windSpeed);
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
        celsius = !UnitsFactory.getTempUnit();

        //save
        UnitsFactory.saveTempUnit(celsius);

        //today
        weather.forecast.today.high = InvertUnitsFactory.invertTempUnit(weather.forecast.today.high);
        weather.forecast.today.low = InvertUnitsFactory.invertTempUnit(weather.forecast.today.low);
        weather.forecast.today.feelsLike = InvertUnitsFactory.invertTempUnit(weather.forecast.today.feelsLike);

        //week
        weather.forecast.week.forEach(function(day) {
            day.high = InvertUnitsFactory.invertTempUnit(day.high);
            day.low = InvertUnitsFactory.invertTempUnit(day.low);
        });
    };

    //Returns the corresponding background color css class to a day state
    $scope.getColor = function(state) {
        var background;

        if(state == 'partly-cloudy-day') {
            background = 'clear-day-background';
        }
        else if(state == 'partly-cloudy-night'){
            background = 'clear-night-background';
        }
        else {
            background = state + '-background';
        }
        return background;
    };

    //Returns the corresponding icon to a day state
    $scope.getIcon = function(state) {
        var icon;

        if(state == 'clear-day') {
            icon = 'ion-ios-sunny-outline';
        }
        else if(state == 'partly-cloudy-day') {
            icon = 'ion-ios-partlysunny-outline';
        }
        else if(state == 'clear-night') {
            icon = 'ion-ios-moon-outline';
        }
        else if(state == 'partly-cloudy-night') {
            icon = 'ion-ios-cloudy-night-outline';
        }
        else if(state == 'rain') {
            icon = 'ion-ios-rainy-outline';
        }
        else if(state == 'cloudy') {
            icon = 'ion-ios-cloudy-outline';
        }
        else if(state == 'snow') {
            icon = 'ion-ios-snowy';
        }

        return icon;
    };

    $scope.getBarColor = function(state) {
        var color;

        if(state == 'clear-day' || state == 'partly-cloudy-day') {
            color = 'bar-energized';
        }
        else if(state == 'clear-night' || state == 'partly-cloudy-night') {
            color = 'bar-royal';
        }
        else if(state == 'rain') {
            color = 'bar-calm';
        }
        else if(state == 'cloudy') {
            color = 'bar-balanced';
        }
        else if(state == 'snow') {
            color = 'bar-assertive';
        }

        return color;
    };
});
