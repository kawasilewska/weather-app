$(document).ready(function() {

    $('.checkByGeo').on('click', function() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;

                var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lon=' + longitude + '&lat=' + latitude + '&units=metric&lang=pl&appid=1caabd42d7e148e50786965db859995f';

                searchText = 'select * from weather.forecast where woeid in (select woeid from geo.places where text="(' + latitude + ',' + longitude + ')") and u="c"';
                var apiUrl2 = 'https://query.yahooapis.com/v1/public/yql?q=' + searchText + '&format=json';

                getWeather('openweathermap', apiUrl);
                getWeather('yahoo', apiUrl2);
            });
        }
    });

    $('.checkTemp').on('click', function() {
       var city = document.getElementById("city").value;

       getWeather('openweathermap', getApiUrl('openweathermap', city));
       getWeather('yahoo', getApiUrl('yahoo', city));
   });

   $('.cityName').on('click', function(event) {
       var city = event.target.id;

       getWeather('openweathermap', getApiUrl('openweathermap', city));
       getWeather('yahoo', getApiUrl('yahoo', city));
   });
});

function getApiUrl(provider, city) {
    var searchText;
    switch (provider) {
        case 'openweathermap':
            return 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=pl&appid=1caabd42d7e148e50786965db859995f';
        case 'yahoo':
            searchText = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + '") and u="c"';
            return 'https://query.yahooapis.com/v1/public/yql?q=' + searchText + '&format=json';
    }
}

function getWeather(provider, apiUrl) {
    switch (provider) {
        case 'openweathermap':
            $.getJSON(apiUrl, function(data) {
                var city = data.name;
                var country = data.sys.country;
                var iconCode = data.weather[0].id;
                var description = data.weather[0].description;
                var tempC = data.main.temp;
                var pressure = data.main.pressure;
                var humidity = data.main.humidity;
                var wind = data.wind.speed;

                var convertedWind = convertVelocity(wind).toFixed(1);

                if (Math.round(tempC) !== tempC) {
                    tempC = data.main.temp.toFixed(1);
                }

                document.getElementById('currentWeatherCard').style.visibility = 'visible';
                document.getElementById('forecastCard').style.visibility = 'visible';

                $("#iconCode").html("<img class='wi wi-owm-" + iconCode + "' alt=' '>");
                $("#description").html(description);
                $("#cityName").html(city + ", " + country);
                $("#temperature").html(tempC + "°C");
                $("#pressure").html(pressure + " hPa");
                $("#humidity").html(humidity + " %");
                $("#wind").html(convertedWind + " km/h");
            });
            break;
        case 'yahoo':
            $.getJSON(apiUrl, function(data) {
                var tempMinCurrentC = data.query.results.channel.item.forecast[0].low;
                var tempMaxCurrentC = data.query.results.channel.item.forecast[0].high;

                $("#tempMinC").html(tempMinCurrentC + " &#8451;");
                $("#tempMaxC").html(tempMaxCurrentC + " &#8451;");

                for (var i = 1; i <= 3; i++) {
                    var date = data.query.results.channel.item.forecast[i].date;
                    var day = data.query.results.channel.item.forecast[i].day;
                    var code = data.query.results.channel.item.forecast[i].code;
                    var text = data.query.results.channel.item.forecast[i].text;
                    var tempMinC = data.query.results.channel.item.forecast[i].low;
                    var tempMaxC = data.query.results.channel.item.forecast[i].high;

                    switch (i) {
                        case 1:
                            $('#day1').html(day + ", " + date);
                            $('#weatherIcon1').html("<img class='wi wi-yahoo-" + code + "' alt=' '>");
                            $('.tomorrow').html(text + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
                            break;
                        case 2:
                            $('#day2').html(day + ", " + date);
                            $('#weatherIcon2').html("<img class='wi wi-yahoo-" + code + "' alt=' '>");
                            $('.overmorrow').html(text + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
                            break;
                        case 3:
                            $('#day3').html(day + ", " + date);
                            $('#weatherIcon3').html("<img class='wi wi-yahoo-" + code + "' alt=' '>");
                            $('.dayAfterOvermorrow').html(text + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
                            break;
                    }
                }
            });
            break;
    }
}

function convertVelocity(wind) {
    return wind * 3600 / 1000;
}
