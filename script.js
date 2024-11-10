// 392ad7f1140af3f2124ba35496b0c06d

// Функция для получения погоды по имени города
async function getWeather(city) {
    try {
        const apiKey = '392ad7f1140af3f2124ba35496b0c06d';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении погоды:', error);
    }
}

// Функция для обновления блока с текущей погодой
async function updateWeather(city) {
    const weatherData = await getWeather(city);
    const weatherType = weatherData.weather[0].main.toLowerCase();
    console.log(weatherData);
    console.log(weatherType);
    saveRecentCity(city);
    // const weatherType = weatherData.weather[0].main.toLowerCase();

    // Здесь вы можете добавить логику для выбора фонового изображения в зависимости от типа погоды
    let backgroundImageUrl;
    switch (weatherType) {
        case 'clear': 
        case "ясно":
            backgroundImageUrl = './image/weatherbackground/clearsky.jpg';
            break;
        case 'clouds':
        case "облачно":
            backgroundImageUrl = './image/weatherbackground/clouds.jpg';
            break;
        case 'drizzle':
            backgroundImageUrl = './image/weatherbackground/drizzle.jpg';
            break;
        case 'shower rain':
        case 'rain':
        case 'дождь':
            backgroundImageUrl = './image/weatherbackground/rain.jpg';
            break;
        case 'thunderstorm':
            backgroundImageUrl = './image/weatherbackground/thunderstorm.jpg';
            break;
        case 'snow':
            backgroundImageUrl = './image/weatherbackground/snow.jpg';
            break;
        case 'mist':
	    case 'haze':
            backgroundImageUrl = './image/weatherbackground/mist.jpg';
            break;
	
        // Добавьте другие варианты погоды, если необходимо
        default:
            backgroundImageUrl = 'default-background.jpg'; // Фоновое изображение по умолчанию
            break;
    }
    // Применяем изменения к фоновому изображению на вашем сайте
    document.body.style.backgroundImage = `url(${backgroundImageUrl})`;


// Функция для получения URL изображения флага по коду страны
function getCountryFlagURL(countryCode) {
    // Формируем URL изображения флага на основе кода страны
    return `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png1000px/${countryCode.toLowerCase()}.png`;
}

// Пример использования функции
const countryCode = weatherData.sys.country; // З
const flagURL = getCountryFlagURL(countryCode);



// Функция для получения полного названия страны по её коду
async function getCountryFullNameByCode(countryCode) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const countryData = await response.json();
        // Возвращаем полное название страны
        countryFullName = countryData[0].name.common
        return countryFullName;
    } catch (error) {
        console.error('Ошибка при получении информации о стране:', error);
        return null; // В случае ошибки возвращаем null или пустую строку
    }
}

const countryFlagElement = document.getElementById('country-flag');

// Пример использования функции
getCountryFullNameByCode(countryCode)
        .then(countryFullName => {
            if (countryFullName) {
                countryFlagElement.title = countryFullName;
            } else {
                countryFlagElement.title = 'Не нашёл страну...';
            }
        });

    

    //получаем локальное время выбранного города
    function convertOffsetToUTC(offset) {
        const utcTimeElement = document.getElementById('utc-time');
        utcTimeElement.textContent = ''; // Очищаем содержимое элемента
        const utcTime = new Date(Date.now() + offset * 1000); // Получаем текущее время UTC с учетом смещения
        const year = utcTime.getUTCFullYear(); // Получаем год UTC
        const month = String(utcTime.getUTCMonth() + 1).padStart(2, '0'); // Получаем месяц UTC (добавляем 1, так как месяцы в JavaScript нумеруются с 0)
        const day = String(utcTime.getUTCDate()).padStart(2, '0'); // Получаем день месяца UTC
        const hours = String(utcTime.getUTCHours()).padStart(2, '0'); // Получаем часы UTC
        const minutes = String(utcTime.getUTCMinutes()).padStart(2, '0'); // Получаем минуты UTC
        const seconds = String(utcTime.getUTCSeconds()).padStart(2, '0'); // Получаем секунды UTC
        return `<span class="material-symbols-outlined">calendar_month</span> ${day}-${month}-${year} / <span class="material-symbols-outlined">
        schedule</span> ${hours}:${minutes}:${seconds}`;
    }
    function updateUTCTime(offset) {
        const utcTimeElement = document.getElementById('utc-time');
        utcTimeElement.innerHTML = `${convertOffsetToUTC(offset)} `;
    }

    // Очищаем предыдущие интервалы, если они есть
    clearInterval(updateWeather.utcTimeIntervalId);
    clearInterval(updateWeather.localTimeIntervalId);

    // Получаем смещение временной зоны (например, из API)
    const offsetInSeconds = weatherData.timezone;
    // Обновляем время UTC сразу
    updateUTCTime(offsetInSeconds);
    // Запускаем интервал обновления времени UTC
    updateWeather.utcTimeIntervalId = setInterval(() => {
        updateUTCTime(offsetInSeconds);
    }, 1000); // Обновляем каждую секунду (1000 миллисекунд)

    //Получаем и выводим sunrise and sunset для выбранного города
    function convertUnixTimestampToLocalTime(timestamp, timezoneOffset) {
        const localTime = new Date((timestamp + timezoneOffset) * 1000);
        return localTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    }
    // Пример использования
    const sunriseUnixTimestamp = weatherData.sys.sunrise; // Пример: время восхода солнца в формате Unix timestamp
    const sunsetUnixTimestamp = weatherData.sys.sunset;
    const timezoneOffset = weatherData.timezone; // Пример: смещение временной зоны для выбранного города в секундах (например, +3 часа)
    const localSunriseTime = convertUnixTimestampToLocalTime(sunriseUnixTimestamp, timezoneOffset);
    const localSunsetTime = convertUnixTimestampToLocalTime(sunsetUnixTimestamp, timezoneOffset);
    document.getElementById('sunrise').innerHTML = `Sunrise <span class="material-symbols-outlined">hourglass_top</span>: ${localSunriseTime}`;
    document.getElementById('sunset').innerHTML = `Sunset <span class="material-symbols-outlined">hourglass_bottom</span>: ${localSunsetTime}`;


    function setWindDirection(degrees) {
        document.getElementById('wind-speed').innerHTML = `Ветер <span class="material-symbols-outlined">air</span>: ${weatherData.wind.speed} м/сек | ${Math.round(weatherData.wind.speed * 3.6)} км/ч <div class="wind-arrow-block"><svg class="wind-arrow" viewBox="0 0 100 100">
        <path d="M50 0 L100 100 L50 80 L0 100 Z" fill="black"/></svg></div> <div class="windDescription">${getWindDirection(degrees)}</div>`;
        const windArrow = document.querySelector('.wind-arrow');
        windArrow.style.transform = `rotate(${degrees + 180}deg)`;
    }

    // Пример использования
    const windDirectionDegrees = weatherData.wind.deg; // Пример: направление ветра в градусах
    setWindDirection(windDirectionDegrees);

    function getWindDirection(degrees) {
        const directions = ['С', 'ССВ', 'В', 'ВЮВ', 'Ю', 'ЮЮЗ', 'З', 'ЗСЗ', 'С']; // Указываем направления ветра в соответствии с градусами
        const index = Math.round((degrees % 360) / 45); // Рассчитываем индекс направления ветра
        return directions[index];
    }
    // Пример использования
    // const windDegrees = weatherData.wind.deg; // Пример: угол направления ветра
    // const windDirection = getWindDirection(windDegrees);
    // console.log(`Направление ветра: ${windDirection}`);


    //формируем остальные данные
    if (weatherData) {
        document.getElementById('city-name').innerHTML = `${weatherData.name}`;
        document.getElementById('country-flag').innerHTML = `<img src=${flagURL}>`;
        document.getElementById('temperature').innerHTML = `<hr> Температура: ${Math.round(weatherData.main.temp)} &degC | ${Math.round(((weatherData.main.temp) * 9)/5) + 32} &degF`;
        document.getElementById('feels-like').innerHTML = `Ощущается как: ${Math.round(weatherData.main.feels_like)}&degC`;
        document.getElementById('weather-description').textContent = `${weatherData.weather[0]['description']}`;
        document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon"><hr>`;
        document.getElementById('humidity').innerHTML = `Влажность <span class="material-symbols-outlined">humidity_mid</span>: ${weatherData.main.humidity}%`;
        document.getElementById('pressure').innerHTML = `Давление <span class="material-symbols-outlined">compress</span>: ${(weatherData.main.pressure * 0.75)} мм.рт.с`;
    }
}



async function saveRecentCity(city) {
    try {
        // Получаем текущий список последних городов из куки, если он существует
        let recentCities = [];
        const cookieValue = document.cookie.split(';').find(cookie => cookie.trim().startsWith('recentCities='));
        if (cookieValue) {
            recentCities = JSON.parse(cookieValue.split('=')[1]);
        }

        // Проверяем, есть ли город уже в списке
        if (!recentCities.includes(city)) {
            // Добавляем новый город в начало списка
            recentCities.unshift(city);

            // Ограничиваем список только последними 5 городами
            recentCities = recentCities.slice(0, 5);

            // Обновляем куки файлы
            document.cookie = `recentCities=${JSON.stringify(recentCities)}`;

            // Вызываем функцию для отображения обновленного списка городов
            displayRecentCities();
        }
    } catch (error) {
        console.error('Ошибка при сохранении города:', error);
    }
}

// Функция для получения значения куки по его имени
function getCookies(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return JSON.parse(decodeURIComponent(cookieValue));
        }
    }
    return null;
}

// Функция для установки значения куки
function setCookies(name, value) {
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; max-age=${60 * 60 * 24 * 7}`; // Устанавливаем срок действия куки на 7 дней
}


function updateRecentCitiesList() {
    const recentCitiesList = document.getElementById('recent-cities-list');
    recentCitiesList.innerHTML = ''; // Очищаем список перед обновлением

    // Получаем текущий список последних городов из куки
    const recentCities = Cookies.get('recentCities');
    if (recentCities) {
        const cities = JSON.parse(recentCities);
        cities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.textContent = city;
            recentCitiesList.appendChild(cityElement);
        });
    }
}

function displayRecentCities() {
    const recentCitiesContainer = document.getElementById('recent-cities');
    let recentCities = [];

    // Получаем текущий список последних городов из куки, если он существует
    const cookieValue = document.cookie.split(';').find(cookie => cookie.trim().startsWith('recentCities='));
    if (cookieValue) {
        recentCities = JSON.parse(cookieValue.split('=')[1]);
    }

    // Очищаем содержимое контейнера
    // recentCitiesContainer.innerHTML = '';

    // Создаем элементы для каждого города и добавляем их в контейнер
    // recentCities.forEach(city => {
    //     const cityElement = document.createElement('div');
    //     cityElement.textContent = city;
    //     recentCitiesContainer.appendChild(cityElement);
    // });
}

// Вызываем функцию для отображения списка последних городов при загрузке страницы
displayRecentCities();















// Функция для получения прогноза погоды на 5 дней по имени города
async function getForecast(city) {
    try {
        const apiKey = '392ad7f1140af3f2124ba35496b0c06d';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении прогноза погоды:', error);
    }
}

// Функция для обновления блока с прогнозом погоды на 5 дней
async function updateForecast(city) {
    const forecastData = await getForecast(city);
    console.log(forecastData);
    if (forecastData) {
        const dailyForecasts = forecastData.list.filter(forecast => {
            // Проверяем, если дата прогноза соответствует 12:00
            const date = new Date(forecast.dt * 1000);
            return date.getHours() === 12;
        });

        for (let i = 0; i < 5; i++) {
            const date = new Date(dailyForecasts[i].dt * 1000);
            const day = date.toLocaleDateString('ru-RU', { weekday: 'long' });
            const temperature = `${Math.round(dailyForecasts[i].main.temp)}`;
            const weatherIcon = dailyForecasts[i].weather[0].icon;
            const chanceOfRain = dailyForecasts[i].pop;
            document.getElementById(`day${i + 1}`).innerHTML = 
            `
            <div class="week-day">${day}</div>
            <div class="forecastDayTemperature">${temperature}°C</div>
            <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"> <hr>
            <div class="forecastMainSecond">
            <div id="forecastWind"><span class="material-symbols-outlined">air</span> ${dailyForecasts[i].wind.speed} м/сек </div>
            <div id="forecastHumidity"><span class="material-symbols-outlined">humidity_mid</span>${dailyForecasts[i].main.humidity} %</div>
            <div id="forecastPressure"><span class="material-symbols-outlined">compress</span>${(dailyForecasts[i].main.pressure * 0.75).toFixed()} мм.рт.с</div>
            <div id="forecastRain"><span class="material-symbols-outlined">rainy</span> ${(chanceOfRain * 100).toFixed()} % </div> 
            </div>
            `;
        }
    }
}



// Функция для получения погоды по пользовательскому городу
async function getCustomWeather() {
    const customCityInput = document.getElementById('custom-city-input').value;
    if (customCityInput) {
        updateWeather(customCityInput);
        updateForecast(customCityInput);
        document.getElementById('custom-city-input').value = '';
    } else {
        alert('Пожалуйста, введите название города!');
    }
}



// Обработка нажатия кнопки Enter
const customCityInput = document.getElementById('custom-city-input');
// Добавляем обработчик события keyup для поля ввода
customCityInput.addEventListener('keyup', function (event) {
    // Проверяем, была ли нажата клавиша Enter
    if (event.key === 'Enter') {
        getCustomWeather();
    }
});

// Обработка нажатия на кнопки выбора городов
document.addEventListener('DOMContentLoaded', function () {
    const cityButtons = document.querySelectorAll('.city-buttons button');
    cityButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const city = this.textContent;
            updateWeather(city);
            updateForecast(city);
        });
    });
});



// Предварительно выбранный город (имитация нажатия на кнопку)
const defaultCity = 'Севастополь';
updateWeather(defaultCity);
updateForecast(defaultCity);

// скрываем погоду на 5 дней под спойлер
// const toggleButton = document.getElementById('toggleButton');
// const content = document.getElementById('fiveDaysWeather');

// toggleButton.addEventListener('click', function() {
//     if (content.style.display === 'none') {
//         content.style.display = 'block'; // Показываем div
//     } else {
//         content.style.display = 'none'; // Скрываем div
//     }
// });