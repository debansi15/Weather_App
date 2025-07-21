const apikey = "89f2c5ea9ecda6b564a156ae65fb291f";
let cityName = null; // to store the last searched city

// Function to fetch weather by geolocation
function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    weatherReport(data);
                })
                .catch(err => console.error("Error fetching location weather:", err));
        });
    }
}

// Function to fetch weather by city name
function fetchWeatherByCity() {
    if (!cityName) return;

    const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`;

    fetch(urlsearch)
        .then(res => res.json())
        .then(data => {
            weatherReport(data);
        })
        .catch(err => console.error("Error fetching city weather:", err));
}

// Called when user searches a city
function searchByCity() {
    cityName = document.getElementById('input').value;
    fetchWeatherByCity();
    document.getElementById('input').value = '';
}

// Load weather on page load by location
window.addEventListener("load", fetchWeatherByLocation);

// Set interval for auto-refresh every 10 minutes
setInterval(() => {
    if (cityName) {
        fetchWeatherByCity();
    } else {
        fetchWeatherByLocation();
    }
}, 10 * 60 * 1000); // 10 minutes

// Function to show weather and forecast
function weatherReport(data) {
    const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

    fetch(urlcast)
        .then(res => res.json())
        .then(forecast => {
            hourForecast(forecast);
            dayForecast(forecast);

            document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
            document.getElementById('temperature').innerText = Math.round(data.main.temp - 273.15) + ' °C';
            document.getElementById('clouds').innerText = data.weather[0].description;

            let icon1 = data.weather[0].icon;
            let iconurl = `https://openweathermap.org/img/w/${icon1}.png`;
            document.getElementById('img').src = iconurl;

            // Show last updated time
            document.getElementById('updated').innerText = "Last Updated: " +
                new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
        })
        .catch(err => console.error("Error fetching forecast:", err));
}

// Show hourly forecast
function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000);

        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });

        let temp = document.createElement('p');
        temp.innerText = Math.round(forecast.list[i].main.temp_max - 273.15) + ' °C / ' +
                         Math.round(forecast.list[i].main.temp_min - 273.15) + ' °C';

        div.appendChild(time);
        div.appendChild(temp);

        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
    }
}

// Show 5-day forecast
function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = '';
    for (let i = 8; i < forecast.list.length; i += 8) {
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000)
            .toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric' });

        let temp = document.createElement('p');
        temp.innerText = Math.round(forecast.list[i].main.temp_max - 273.15) + ' °C / ' +
                         Math.round(forecast.list[i].main.temp_min - 273.15) + ' °C';

        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = forecast.list[i].weather[0].description;

        div.appendChild(day);
        div.appendChild(temp);
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
    }
}
