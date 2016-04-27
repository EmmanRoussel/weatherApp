// Main Controller for the app
// Controller moved in different file suggested by Adam Vigneaux
app.controller('WeatherCtrl', function($scope, $ionicSideMenuDelegate,
    ForecastFactory, UnitsFactory, InvertUnitsFactory) {

    var weather = this;
    var initialSpeedUnit;
    var initialTempUnit;

    $scope.temperatureUnitList = [
        { text: "Fahrenheit", value: "f" },
        { text: "Celsius", value: "c" }
    ];

    $scope.speedUnitList = [
        { text: "Mph", value: "mph" },
        { text: "Km/h", value: "km/h" }
    ];

    //Initialization
    weather.forecast = ForecastFactory;

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
        weather.forecast.today.currentTemp = InvertUnitsFactory.invertTempUnit(weather.forecast.today.currentTemp);

        //week
        weather.forecast.week.forEach(function(day) {
            day.high = InvertUnitsFactory.invertTempUnit(day.high);
            day.low = InvertUnitsFactory.invertTempUnit(day.low);
        });
    };

    // Returns the corresponding background color css class to a day state
    // param: state: String representing the weather condition
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

    // Returns the corresponding icon to a day state
    // param: state: String representing the weather condition
    $scope.getIcon = function(state) {
        var icon;

        switch (state) {
            case 'clear-day':
                icon = 'ion-ios-sunny-outline';
                break;
            case 'partly-cloudy-day':
                icon = 'ion-ios-partlysunny-outline';
                break;
            case 'clear-night':
                icon = 'ion-ios-moon-outline';
                break;
            case 'partly-cloudy-night':
                icon = 'ion-ios-cloudy-night-outline';
                break;
            case 'rain':
                icon = 'ion-ios-rainy-outline';
                break;
            case 'cloudy':
                icon = 'ion-ios-cloudy-outline';
                break;
            case 'snow':
                icon = 'ion-ios-snowy';
                break;
        }

        return icon;
    };

    // Returns the corresponding bar color to a day state
    // param: state: String representing the weather condition
    $scope.getBarColor = function(state) {
        var color;

        switch (state) {
            case 'clear-day':
            case 'partly-cloudy-day':
                color = 'bar-energized';
                break;
            case 'clear-night':
            case 'partly-cloudy-night':
                color = 'bar-royal';
                break;
            case 'rain':
                color = 'bar-calm';
                break;
            case 'cloudy':
                color = 'bar-balanced';
                break;
            case 'snow':
                color = 'bar-assertive';
                break;
        }

        return color;
    };
});
