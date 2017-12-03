$(document).ready(function() {
    $('#checkGeo').on('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;

                var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lon=' + longitude + '&lat=' + latitude + '&units=metric&lang=pl&appid=1caabd42d7e148e50786965db859995f';
                console.log(apiUrl);

                getWeather(apiUrl);
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
    switch (provider) {
        case 'openweathermap':
            return 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=pl&appid=1caabd42d7e148e50786965db859995f';
        case 'yahoo':
            var searchText = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + '") and u="c"';

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
                $("#cityGeo").html(city + ", " + country);
                $("#temperatureGeo").html(tempC + "°C");
                $("#detailsGeo").html("Ciśnienie: " + pressure + " hPa<br /> Wilgotność: " + humidity + " %<br />Min temperatura: " + tempMinC + " &#8451;<br />Max temperatura: " + tempMaxC + " &#8451; <br />Wiatr: " + convertedWind + " km/h");
            });
            break;
        case 'yahoo':
            $.getJSON(apiUrl, function(data) {
                var date = data.query.results.channel.item.forecast[1].date;
                var day = data.query.results.channel.item.forecast[1].day;
                var tempMinC = data.query.results.channel.item.forecast[1].low;
                var tempMaxC = data.query.results.channel.item.forecast[1].high;
                $('.tomorrow').html(day + ", " + date + "<br />" + tempMinC + "°C " + tempMaxC + "°C");

                var date = data.query.results.channel.item.forecast[2].date;
                var day = data.query.results.channel.item.forecast[2].day;
                var tempMinC = data.query.results.channel.item.forecast[2].low;
                var tempMaxC = data.query.results.channel.item.forecast[2].high;
                $('.overmorrow').html(day + ", " + date + "<br />" + tempMinC + "°C " + tempMaxC + "°C");

                var date = data.query.results.channel.item.forecast[3].date;
                var day = data.query.results.channel.item.forecast[3].day;
                var tempMinC = data.query.results.channel.item.forecast[3].low;
                var tempMaxC = data.query.results.channel.item.forecast[3].high;
                $('.dayAfterOvermorrow').html(day + ", " + date + "<br />" + tempMinC + "°C " + tempMaxC + "°C");
            });
            break;
    }
}

function convertVelocity(wind) {
    return wind * 3600 / 1000;
}
