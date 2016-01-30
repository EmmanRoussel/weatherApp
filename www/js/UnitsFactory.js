// Factory used to save the units selected when app is closed
// Adapted from the Ionic Todo app example
app.factory('UnitsFactory', function() {
    return {
        saveSpeedUnit: function(speedUnit) {
            window.localStorage['speedUnit'] = JSON.stringify(speedUnit);
        },
        saveTempUnit: function(tempUnit) {
            window.localStorage['tempUnit'] = JSON.stringify(tempUnit);
        },
        getSpeedUnit: function() {
            // || false for when there is no data saved to avoid accessing
            // an undefined object and getting an error
            return JSON.parse(window.localStorage['speedUnit'] || false);
        },
        getTempUnit: function() {
            // || false for when there is no data saved to avoid accessing
            // an undefined object and getting an error
            return JSON.parse(window.localStorage['tempUnit'] || false);
        }
    }
});
