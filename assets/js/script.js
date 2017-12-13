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
                var icon = data.weather[0].icon;
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
                document.getElementById('forecastCard2').style.visibility = 'visible';

                $(".card-title").html("Dzisiaj, " + moment().locale('pl').format('LL'));

                if (icon.toString().indexOf('n') > -1) {
                    $("#iconCode").html("<i class='wi wi-owm-night-" + iconCode + "'></i>");
                } else {
                    $("#iconCode").html("<i class='wi wi-owm-day-" + iconCode + "'></i>");
                }

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
                var forecast = data.query.results.channel.item.forecast;

                forecast.forEach(function(forecastDay, index) {
                    if (index === 0) {
                        var tempMinCurrentC = forecast[0].low;
                        var tempMaxCurrentC = forecast[0].high;

                        $("#tempMinC").html(tempMinCurrentC + " &#8451;");
                        $("#tempMaxC").html(tempMaxCurrentC + " &#8451;");
                    } else {
                        var day = index;
                        var date = forecastDay.date;
                        var imageCode = forecastDay.code;
                        var text = forecastDay.text;
                        var tempMinC = forecastDay.low;
                        var tempMaxC = forecastDay.high;

                        var convertedText = translate(text);

                        $('#day' + day).html(moment().locale('pl').add(day, 'days').format('ddd') + ', ' + moment().locale('pl').add(day, 'days').format('ll'));
                        $('#weatherIcon' + day).html('<i class="wi wi-yahoo-' + imageCode + '"></i>');
                        $('.forecastDay' + day).html(convertedText + "<br />Min: " + tempMinC + "°C, Max: " + tempMaxC + "°C");
                    }
                });
            });
            break;
    }
}

function convertVelocity(wind) {
    return wind * 3600 / 1000;
}

var weatherStatusesEN = [
    "Tornado",
    "Tropical Storm",
    "Hurricane",
    "Severe Thunderstorms",
    "Thunderstorms",
    "Mixed Rain And Snow",
    "Mixed Rain And Sleet",
    "Mixed Snow And Sleet",
    "Freezing Drizzle",
    "Drizzle",
    "Freezing Rain",
    "Showers",
    "Snow Flurries",
    "Light Cnow Showers",
    "Blowing Cnow",
    "Snow",
    "Hail",
    "Sleet",
    "Dust",
    "Foggy",
    "Haze",
    "Smoky",
    "Blustery",
    "Windy",
    "Cold",
    "Cloudy",
    "Mostly Cloudy",
    "Partly Cloudy",
    "Clear",
    "Sunny",
    "Fair",
    "Mixed Rain And Hail",
    "Hot",
    "Isolated Thunderstorms",
    "Scattered Thunderstorms",
    "Scattered Showers",
    "Heavy Snow",
    "Scattered Snow Showers",
    "Partly Cloudy",
    "Thundershowers",
    "Snow Showers",
    "Isolated Thundershowers",
    "Rain And Snow",
    "Partialy Cloud",
    "AM Showers",
    "PM Showers",
    "PM Thunderstorms",
    "Light Rain with Thunder",
    "Heavy Rain",
    "Mostly Sunny",
    "Light Rain",
    "AM Rain",
    "PM Rain",
    "Heavy Thunderstorms",
    "Rain",
    "Breezy"
];
var weatherStatusesPL = [
    "tornado",
    "burza tropikalna",
    "huragan",
    "ostre burze z piorunami",
    "burze z piorunami",
    "deszcz ze śniegiem",
    "deszcz i deszcz ze śniegiem",
    "śnieg i deszcz ze śniegiem",
    "marznąca mżawka",
    "mżawka",
    "marznący deszcz",
    "ulewa",
    "zawieja śnieżna",
    "lekkie opady śniegu",
    "podmuchy śniegu",
    "śnieg",
    "grad",
    "śnieg z deszczem",
    "kurz",
    "mgliście",
    "mgła",
    "smog",
    "przenikliwie zimno?",
    "wietrznie",
    "zimno",
    "całkowite zachmurzenie",
    "przeważnie pochmurno",
    "częściowe zachmurzenie",
    "bezchmurnie",
    "słonecznie",
    "fair",
    "deszcz z gradem",
    "upał",
    "przelotne burze z piorunami",
    "lekki deszcz z piorunami",
    "słabe, przelotne opady deszczu",
    "obfite opady śniegu",
    "rozproszone opady śniegu",
    "częściowe zachmurzenie",
    "burze z piorunami",
    "opady śniegu",
    "pojedyncze burze",
    "deszcz ze śniegiem",
    "rozproszone chmury",
    "ulewa",
    "ulewa",
    "burze z piorunami",
    "lekki deszcz z piorunami",
    "ulewa",
    "przeważnie słonecznie",
    "lekki deszcz",
    "deszcz",
    "deszcz",
    "ciężkie burze z piorunami",
    "deszcz",
    "wietrznie"
];

function translate(text) {
    var index = weatherStatusesEN.indexOf(text);

    if (index !== -1) {
        return weatherStatusesPL[index];
    }
}
