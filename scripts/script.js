$(document).ready(function () {
    //DOM variables
    var UVEl = $("<button>");
    var colEl = $("<div>");
    var cardEl = $("<div>");
    var tempEl = $("<h4>");
    var iconEl = $("<img>");
    var humidityEl = $("<h4>");
    var dateEl = $("<h4>");

    //JS Variables
    var city = "atlanta";
    var today = new Date();
    var date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var b = 0

    //Function Definitions
    function currentWeather(city) {

        console.log(city);
        var queryURLcurrent = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ba38bb11b45233a9a2d3b321afc00ba8";
        //Get current city weather from Current Weather API
        $.ajax({
            url: queryURLcurrent,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            console.log(response.name);
            console.log(response.main.temp);
            console.log(response.main.humidity);
            console.log(response.wind.speed);

            //check for bad or unavailable city name

            //Insert relevant data from API to targeted elements by ID
            $("#city-name").text(response.name + " (" + date + ") ");
            console.log(response.weather[0].icon);
            var icon = response.weather[0].icon;
            //Append weather icon (from API) to city name element
            $("#weather-icon").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");

            //Convert temp from deg. Kelvin to deg. F and convert to integer while inserting text
            $("#temperature").text(parseInt(((response.main.temp) - 273.15) * 1.8) + 32);
            $("#humidity").text(response.main.humidity);
            $("#wind-speed").text(response.wind.speed);
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;
            //Add button with city name to store query below search input field

            var cityButtonEl = $("<button>");
            cityButtonEl.text(city);
            cityButtonEl.attr("id", "button" + b);
            b = b + 1;
            cityButtonEl.attr("class", "btn-light btn-lg btn-block");
            $("#searchCol").append(cityButtonEl);
            

            //Get UV index from UV Index API
            var queryUVindex = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=ba38bb11b45233a9a2d3b321afc00ba8";
           
            $.ajax({
                url: queryUVindex,
                method: "GET"
            }).then(function (responseUV) {
                var UVindex = responseUV[0].value
                console.log(UVindex);
                UVEl.remove();
                UVEl = $("<button>");
                UVEl.text(UVindex);
                UVEl.attr("class", "btn-success");
                $("#UV-index").append(UVEl);

                //apply coloring to UV index depending on favorable, moderate, or severe value
                if (UVindex >= 4 && UVindex <= 8) {
                    UVEl.attr("class", "btn-warning");
                } else if (UVindex >> 8) {
                    UVEl.attr("class", "btn-danger");
                }

            })
        });

        // Start 5 day forecast
        var queryURLfiveday = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=ba38bb11b45233a9a2d3b321afc00ba8"
        $.ajax({
            url: queryURLfiveday,
            method: "GET"
        }).then(function (responseFiveDay) {
            console.log(responseFiveDay);
            $("#forecastRow").empty();
            var a = 0;

            for (i = 0; i < 5; i++) {
                colEl = $("<div>");
                colEl.attr("class", "col-sm-2");
                $("#forecastRow").append(colEl);
                cardEl = $("<div>");
                cardEl.attr("class", "card small card-body");
                colEl.append(cardEl);
                dateEl = $("<h4>");
                var date = responseFiveDay.list[a].dt_txt.slice(0, -9)
                dateEl.text(date);
                cardEl.append(dateEl);
                var icon = responseFiveDay.list[a].weather[0].icon;
                iconEl = $("<img>");
                iconEl.attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
                iconEl.attr("width", 40);
                iconEl.attr("height", 40);
                cardEl.append(iconEl);
                tempEl = $("<h5>");
                var temp = parseInt(((responseFiveDay.list[a].main.temp - 273.15) * 1.8) + 32);
                tempEl.text("Temp.: " + temp + "deg. F");
                cardEl.append(tempEl);
                humidityEl = $("<h5>");
                humidityEl.text("Humidity: " + responseFiveDay.list[a].main.humidity + "%");
                cardEl.append(humidityEl);
                a = a + 8;
                console.log(a);
            }
        })
    };

    //Function calls
    currentWeather(city);

    //Event listeners
    $("#searchBtn").on("click", function () {
        var city = $("#searchText").val();
        // localStorage.setItem("cityName0", city);
        currentWeather(city);
        console.log(city);
    })

    $("#button0").on("click", function () {
        var city = $("#button0").val();
        currentWeather(city);
        console.log(city);
    })

})