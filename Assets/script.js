// This is our API key
const APIKey = "bdd330c07691d5875d3fecb0a47f4f91";
const APIHost = "https://api.openweathermap.org/data/2.5/"
var cityList = []

// var cities = $(".searchTerm"); 
function KToF(degrees) {
    return (degrees - 273.15) * 1.80 + 32.0;
}

function getDateFromTimestamp(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var month = a.getUTCMonth() + 1; //months from 1-12
    var day = a.getUTCDate();
    var year = a.getUTCFullYear();
    return month + "/" + day + "/" + year;
  }

var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

function searchForCity(city){
    if(!(cityList.includes(city))){
        cityList.push(city);
        renderCityList();
    }
    
    $("#cityName").text(city)
    var dt = new Date()
    var month = dt.getUTCMonth() + 1; //months from 1-12
    var day = dt.getUTCDate();
    var year = dt.getUTCFullYear();
    
    $("#todayDate").text(month + "/" + day + "/" + year)
    console.log(input)
    $("#user_input").text("");

    // Here we are building the URL we need to query the database
    // var forecastURL = APIHost + "forecast/daily?q=" + city + "&appid=" + APIKey;
    var weatherURL = APIHost + "weather?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: weatherURL,
        method: "GET"
    })
        .then(function(response){

            // Log the resulting object
            console.log(response);

            // Convert the temp to fahrenheit
            var tempF = KToF(response.main.temp);
            $("#icon").attr("src",`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
            // Transfer content to HTML
            $("#tempF").text("Temperature (F) " + tempF);
            $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
            $("#currentWind").text("Wind Speed: " + response.wind.speed);

            
            var uviURL = APIHost + `uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIKey}`

            $.ajax({
                url: uviURL,
                method: "GET"
            }).then((r)=>{
                console.log(r);
                $("#currentUV").text("UV Index: " + r.value);
                
            }).catch((e)=>{
                console.log(e);
            })

            var onecallURL = `${APIHost}onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&exclude=hourly,minutely,alerts,&appid=${APIKey}`
            $.ajax({
                url: onecallURL,
                method: "GET"
            }).then((r)=>{
                console.log(r);
                // HERES THE FORECAST
                var container = $("#fiveDayForecastContainer");
                container.empty();
                for (var i = 0; i < 5; i++)
                {
                    
                    var newForecast= $("<div>")
                    newForecast.addClass("card");
                    
                    var dateJq = $("<div>")
                    dateJq.text(getDateFromTimestamp(r.daily[i].dt))
                    newForecast.append(dateJq)

                    var icon = $("<img>")
                    icon.attr("src", `http://openweathermap.org/img/wn/${r.daily[i].weather[0].icon}.png`)
                    newForecast.append(icon)

                    var temp = $("<div>")
                    temp.text(`Temp: ${KToF(r.daily[i].temp.day)} F`)
                    newForecast.append(temp)

                    var humidity = $("<div>")
                    humidity.text("Humidity: " + r.daily[i].humidity + "%")
                    newForecast.append(humidity)

                    container.append(newForecast);
                }

            }).catch((e)=>{
                console.log(e);
            });



        });
    };


        


    // Function for displaying city names
    function renderCityList() {
        // Deleting the city name buttons prior to adding new city name buttons
        $("#cityList").empty();

        cityList.forEach((city) => {
            var a = $("<a>");
            a.addClass("list-group-item list-group-item-action");
            a.attr("data-name");
            a.text(city);
            $("#cityList").append(a);
            a.click((name)=>{
                searchForCity(name)
            })
        })
    }

$(document).ready(function () {
    $("#input").click(function () {
        searchForCity($(".searchTerm").val());
    }
)
});