$(document).ready(function() {

    $('.checkByGeo').on('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;

                var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lon=' + longitude + '&lat=' + latitude + '&units=metric&lang=pl&appid=1caabd42d7e148e50786965db859995f';
                console.log(apiUrl);

                searchText = 'select * from weather.forecast where woeid in (select woeid from geo.places where text="(' + latitude + ',' + longitude + ')") and u="c"';
                var apiUrl2 = 'https://query.yahooapis.com/v1/public/yql?q=' + searchText + '&format=json';
                console.log(apiUrl2);

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
                var iconCode = data.weather[0].icon;
                var description = data.weather[0].description;
                var tempC = data.main.temp;
                var tempMinC = data.main.temp_min;
                var tempMaxC = data.main.temp_max;
                var pressure = data.main.pressure;
                var humidity = data.main.humidity;
                var wind = data.wind.speed;

                var convertedWind = convertVelocity(wind).toFixed(1);

                if (Math.round(tempC) !== tempC) {
                    tempC = data.main.temp.toFixed(1);
                }

                $("#iconCode").html("<img src='http://openweathermap.org/img/w/" + iconCode + ".png' alt='Weather icon'>" + " <br />" + description);
                $("#cityName").html(city + ", " + country);
                $("#temperature").html(tempC + "°C");
                $("#details").html("Ciśnienie: " + pressure + " hPa<br /> Wilgotność: " + humidity + " %<br />Min temperatura: " + tempMinC + " &#8451;<br />Max temperatura: " + tempMaxC + " &#8451; <br />Wiatr: " + convertedWind + " km/h");
            });
            break;
        case 'yahoo':
            $.getJSON(apiUrl, function(data) {
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
                            $('.tomorrow').html("<img src='http://l.yimg.com/a/i/us/we/52/" + code + ".gif' alt='Weather icon'>" + " <br />" + text + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
                            break;
                        case 2:
                            $('#day2').html(day + ", " + date);
                            $('.overmorrow').html("<img src='http://l.yimg.com/a/i/us/we/52/" + code + ".gif' alt='Weather icon'>" + " <br />" + text + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
                            break;
                        case 3:
                            $('#day3').html(day + ", " + date);
                            $('.dayAfterOvermorrow').html("<img src='http://l.yimg.com/a/i/us/we/52/" + code + ".gif' alt='Weather icon'>" + " <br />" + text + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
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
