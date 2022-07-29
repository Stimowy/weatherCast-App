const place = document.querySelector('#place')
const autocomplete = document.querySelector('#autoComplete')
let lat, lon;
let weatherPlace = document.querySelector('#weather')

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'bfd4cd0d39msh6aaee40a99c08eep197babjsn15d3e3cd1a34',
		'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
	}
};
place.addEventListener('change', () => {
    let value = place.value.trim().replace(" ", "+")
    let position
    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&format=json&apiKey=768b97196b9049fcb1749efe6b76370f`)
    .then(data => data.json())
    .then(api => {
        autocomplete.innerHTML = "";
        for(let i = 0; i <= api.results.length - 1; i++){
            autocomplete.innerHTML += `<li class="item">${api.results[i].formatted}</li>`
        }
        let items = document.querySelectorAll('.item')
                items.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        lat = api.results[index].lat;
                        lon = api.results[index].lon;
                        autocomplete.innerHTML = ""
                        fetch(`https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=${lat}&lon=${lon}`, options)
                        .then(a => a.json())
                        .then(weather => {
                            weatherPlace.innerHTML = ""
                            weather.data.forEach((item) => {
                                console.log(item)
                                let img = 'img/Sun.png'
                                if (parseFloat(item.temp) > 22) {
                                    img = 'img/Sun.png'
                                    if(parseFloat(item.clouds) > 60){
                                        img = 'img/Sun&Cloud.png'
                                    }
                                }
                                if(parseFloat(item.clouds) > 60){
                                    img = 'img/Cloud.png'
                                }
                                if(parseFloat(item.precip) > 1){
                                    img = 'img/Rain.png'
                                    if(parseFloat(item.wind_spd) > 4){
                                        img = 'img/Storm.png'
                                    }
                                }
                                
                                weatherPlace.innerHTML += `
                                    <div class="oneDay">
                                        <img class="weatherImg" src="${img}">
                                        <p class="fullDay">${item.datetime.slice(0, -3)}, ${item.datetime.slice(-2)}:00</p>
                                        <p class="temp">${item.temp}°C</p>
                                        <p class="wind">wiatr: ${item.wind_spd}km/h</p>
                                        <p class="clouds">zachmurzenie: ${item.clouds}%</p>
                                        <p class="rain">opady: ${item.precip.toFixed(2)}%</p>
                                    </div>
                                `
                            })

                        })
                        
                    })
                    
                })
        
    })
    
})

