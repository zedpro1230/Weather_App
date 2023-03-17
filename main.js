const temp =document.querySelector('#temp')
const date =document.querySelector('#date_time')
const currentLocation = document.querySelector('.current_location')
const currentCondition=document.querySelector('#condition')
const rainPercent=document.querySelector('#rain')
const mainIcon=document.querySelector('#icon')
const uvIndex=document.querySelector('.Uv_index')
const uvText=document.querySelector('.Uv_text')
const windSpeed=document.querySelector('.wind')
const windStatus=document.querySelector('.wind_status')
const sunRise=document.querySelector('.sunrise')
const sunSet=document.querySelector('.sunset')
const humidity=document.querySelector('.humidity')
const humidityStatus=document.querySelector('.humidity_status')
const visivility=document.querySelector('.visivility')
const visivilityStatus=document.querySelector('.visivility_status')
const airQuality=document.querySelector('.Air_quality')
const airQualityStatus=document.querySelector('.Air_quality_status')
const weatherCards =document.querySelector('#weather_cards')
const celsiusBtn = document.querySelector(".celsious ")
const fahrenheitBtn =document.querySelector('.fahrenheit')
const hourlyBtn =document.querySelector('.hourly')
const weekBtn =document.querySelector('.week')
const tempUnit = document.querySelectorAll('.temp_unit')
const searchForm = document.querySelector('#search')
const searchInput =document.querySelector('#countries_search')
console.log(searchInput)
let currentCity = ""
let currentUnit = "C"
let hourlyorWeek = "Week"

// Fuction get date  and time render to sidebar
const getDateTime = ()=>{
    let now = new Date()
    hour = now.getHours()
    minute = now.getMinutes()

    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]

    // Get hour format
    hour =hour % 12
    if(hour < 10){
        hour = "0"+ hour
    }
    if(minute < 10){
        minute = "0"+ minute
    }

    let dayString = days[now.getDay()]

    console.log(dayString,hour,minute)
    return `${dayString},${hour}:${minute}`
}
date.innerText = getDateTime()
// Fuction update  time every second render to sidebar
setInterval(()=>{
    date.innerText = getDateTime()
},1000)
// Fetch dat Ip location
const getAPI =()=>{
    fetch("https://geolocation-db.com/json/",{
        method:'GET'
    })
    .then((response)=>response.json())
    .then((data)=>{
        
        currentCity =data.country_name
        console.log(currentCity)
        getWeatherData(currentCity,currentUnit,hourlyorWeek)
    })
   
}
getAPI()
// Function get weather data
const getWeatherData =(city,unit,hourlyorWeek)=>{
    const apiKey="XYHHZ9CZLFZQLJQ48YZ2FPZV6"
    fetch(
       
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method:"GET"
        }
    ).then((Response)=>Response.json())
    .then((data)=>{
        console.log(data)
        let today = data.currentConditions;
        console.log(data.address)
        if(unit ==='C'){
            temp.innerText=today.temp
        }
        else{
            temp.innerText=celsiusToFahrenheit(today.temp)
        }
        currentLocation.innerText= data.resolvedAddress
        currentCondition.innerText=today.conditions
        rainPercent.innerText="Perc - " + today.precip + "%"
        uvIndex.innerText = today.uvindex
        windSpeed.innerText = today.windspeed
        humidity.innerText=today.humidity+"%"
        visivility.innerText=today.visibility
        airQuality.innerText= today.winddir
        console.log(today.uvindex)
        uvindexStatus(today.uvIndex)
        humidityStatusCalculate(today.humidity)
        visivilityStatusCalulate(today.visibility)
        airQualityStatusCalculate(today.winddir)
        sunRise.innerText = convertTimeFormat(today.sunrise)
        sunSet.innerText = convertTimeFormat(today.sunset)
        console.log(today.icon)
        mainIcon.src=getIcon(today.icon)

        if(hourlyorWeek ==="hourly"){
            updateForecast(data.days[0].hours,unit,"day")

        }
        else {
            updateForecast(data.days,unit,"week")
        }
        

    })
    .catch((err)=>{
        alert('Can not Found City in data')
        getAPI()
        
    })
}

const celsiusToFahrenheit=(celsius)=>{
    let fahrenheit = parseFloat(1.8*celsius+32).toFixed(1)
    return fahrenheit
}
// Calculate UV status
const uvindexStatus = (uvindex)=>{
    if(uvindex <= 2 &&  uvindex >0){
        uvText.innerText = "Low"
    }
    else if(uvindex <=5){
        uvText.innerText = "Moderate"
    }
    else if(uvindex <=7){
        uvText.innerText = "Hight"
    }
    else if(uvindex <=10){
        uvText.innerText = "Very Hight"
    }
    else{
        uvText.innerText = "Extreme"
    }
}
// Calculate humi status
const  humidityStatusCalculate= (humidity)=>{
    if(humidity <= 30 && humidity >0){
        humidityStatus.innerText = "Low"
    }
    else if(humidity <=60){
        humidityStatus.innerText = "Moderate"
    }
    else{
        humidityStatus.innerText = "Hight"
    }
}
// Calculate visi status
const  visivilityStatusCalulate =(visi)=>{
    if(visi <= 0.3 && visi >0){
        visivilityStatus.innerText ="Dense Fog"
    }
    else if(visi <= 0.16){
        visivilityStatus.innerText = "Moderate Fog"
    }
    else if(visi <= 0.35){
        visivilityStatus.innerText = "Light Fog"
    }
    else if(visi <= 1.13){
        visivilityStatus.innerText = "Very Light Fog"
    }
    else if(visi <= 2.16){
        visivilityStatus.innerText = "Light Mist"
    }
    else if(visi <= 5.4){
        visivilityStatus.innerText = "Very Light Mist"
    }
    else if(visi <= 10.8){
        visivilityStatus.innerText = "Clear Air"
    }
    else{
        visivilityStatus.innerText = "Very Clear Air"
    }
}
// Calculate Air status
const airQualityStatusCalculate =(air)=>{
    if (air <= 50 ){
        airQualityStatus.innerText ="Good"
    }
    else if (air <=100){
        airQualityStatus.innerText= "Moderate"
    }
    else if (air <=150){
        airQualityStatus.innerText= "Unhealthy"
    }
    else if (air <=100){
        airQualityStatus.innerText= "Unhealthy"
    }
    else if (air <=100){
        airQualityStatus.innerText= "Very Unhealthy"
    }
    else if (air <=100){
        airQualityStatus.innerText= "Hazardous"
    }
}
// Get sunrise - Sun set format
const convertTimeFormat =(time)=>{
    let hour=time.split(":")[0];
    let minute=time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am"
    hour = hour & 12;
    hour = hour ? hour : 12;
        hour = hour < 10 ? "0" + hour : hour;
        minute = minute < 10 ? "" + minute : minute;
        let strTime = hour + ":" + minute + " " +ampm
    console.log(strTime )
    return strTime
}
// Change main picture base on condition
const getIcon=(condition)=>{
    if(condition ==="partly-cloudy-day"){
        return "./assets/Img/cloudy_day.png"
    }
    else if (condition ==="partly-cloudy-night"){
        return "./assets/Img/cloudy_night.png"
    }
    else if (condition ==="rain"){
        return "./assets/Img/rain.png"
    }
    else if (condition ==="clear-day"){
        return "./assets/Img/day.png"
    }
    else if (condition ==="clear-night"){
        return "./assets/Img/night.png"
    }
    else{
        return "./assets/Img/2580627.PNG"
    }
}

const getDateName=(date)=>{
    let day = new Date(date)
    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    return days[day.getDay()]
}

const getHour=(time)=>{
    let hour =time.split(":")[0]
    let min = time.split(":")[1]
    if (hour > 12){
        hour =hour -12
        return `${hour}:${min} PM`
    }
    else{
        return `${hour}:${min} AM`
    }
}
const updateForecast =(data,unit,type)=>{
    weatherCards.innerHTML = ""
    let day = 0
    let numCards=0
    if (type ==="day"){
        numCards =24
    }
    else {
        numCards = 7
    }

    for (let i= 0; i < numCards;i++){
        let card =document.createElement("div");
        card.classList.add("card")

        let dayName = getHour(data[day].datetime) // 
        if (type === "week"){
            dayName =getDateName(data[day].datetime)
        }
        let dayTemp = data[day].temp;
        if (unit ==="F"){
            dayTemp =celsiusToFahrenheit(data[day].temp)
        }
        let iconCondition = data[day].icon
        let iconSrc = getIcon(iconCondition)
        let tempUnit = "°C"
        if (unit === "F"){
            tempUnit="°F"
        }
        card.innerHTML=`
        <h2 class="day_name">${dayName}</h2>
        <div class="card_icon">
          <img src="${iconSrc}" alt="">
        </div>
        <div class="day_temp">
          <h2 class="temp">${dayTemp}</h2>
          <span class="temp_unit">${tempUnit}</span>
        </div>
        `
        console.log(card)
        weatherCards.appendChild(card)
        day++
    }
}
fahrenheitBtn.addEventListener('click',()=>{
    changeUnit('F')
})
celsiusBtn.addEventListener('click',()=>{
    changeUnit('C')
})
// change C to F
const changeUnit =(unit)=>{
    if (currentUnit !== unit){
        currentUnit = unit;
        {
            // change unit document
            tempUnit.forEach((elem)=>{
                elem.innerText = `${unit.toUpperCase()}`
            })
            if(unit === "C"){
                celsiusBtn.classList.add('active')
                fahrenheitBtn.classList.remove('active')
            }
            else{
                celsiusBtn.classList.remove('active')
                fahrenheitBtn.classList.add('active')
            }
            getWeatherData(currentCity,currentUnit,hourlyorWeek)
        }
    }
}
// 
hourlyBtn.addEventListener('click',()=>{
    changeTimeSpan('hourly')

})
weekBtn.addEventListener('click',()=>{
    changeTimeSpan('week')
    
})

const changeTimeSpan = (unit)=>{
    if(hourlyorWeek!== unit){
        hourlyorWeek = unit
        if (unit ==="hourly"){
            hourlyBtn.classList.add('active')
            weekBtn.classList.remove('active')
        }
        else{
            hourlyBtn.classList.remove('active')
            weekBtn.classList.add('active')
        }
        getWeatherData(currentCity,currentUnit,hourlyorWeek)
    }
}

//  Search for weather

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    let location = searchInput.value
    if(location){
        currentCity = location
        getWeatherData(currentCity,currentUnit,hourlyorWeek)
    }
    else{
        alert('Please select a city')
    }
})