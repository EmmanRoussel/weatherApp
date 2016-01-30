// Factory that provides two functions to invert Units (one for temperature and one for speed)
app.factory('InvertUnitsFactory', function(UnitsFactory, SPEED_UNIT_CONSTANT) {
    return {
        /* Converts temperature from Celsius to Fahrenheit or
        from Fahrenheit to Celsius */
        invertTempUnit: function(temp) {
            var newTemp;

            if(UnitsFactory.getTempUnit()) {
                newTemp = Math.round((temp - 32) * (5/9));
            }
            else {
                newTemp = Math.round((temp * 1.8) + 32);
            }
            return newTemp;
        },

        /* Converts speed from mph to km/h or from km/h to mph */
        invertSpeedUnit: function(speed) {
            var newSpeed;

            if(UnitsFactory.getSpeedUnit()) {
                newSpeed = Math.round(speed/SPEED_UNIT_CONSTANT);
            }
            else {
                newSpeed = Math.round(speed * SPEED_UNIT_CONSTANT);
            }
            return newSpeed;
        }
    };
});
