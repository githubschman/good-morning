import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';


export const checkPassword = password => ({type: 'LOG_IN', password})
export const getGif = url => ({type: 'GM_GIF', url})
export const weatherInfo = info => ({type: 'WEATHER_INFO', info})
export const precipInfo = bool => ({type: 'PRECIPITATION', bool})
export const transitInfo = info => ({type: 'TRANSIT_INFO', info})

let initialState = {
    passwordText: '',
    needUmbrella: false,
    jacketIndex: 0,
    temp: 0,
    loggedIn: false,
    gif: '',
    travel: {}
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOG_IN': {
            if(action.password === process.env.REACT_APP_PASSWORD){
                return Object.assign({}, state, {loggedIn: true})
            }
            else{
                return Object.assign({}, state, {passwordText: 'wrong password!'})
            }
        }
        case 'GM_GIF' : {
            return Object.assign({}, state, {gif: action.url})
        }
        case 'WEATHER_INFO' : {
            return Object.assign({}, state, {jacketIndex: action.info.isCold, temp: action.info.currentTemp})
        }
        case 'PRECIPITATION' : {
            return Object.assign({}, state, {needUmbrella: action.bool})
        }
        case 'TRANSIT_INFO' : {
            return Object.assign({}, state, {travel: action.info})
        }
		default: {
			return state
		}
	}
}



export const fetchInfo = (a) => dispatch => {

    // set vars
    let timeOfDay = a ? 'morning' : 'goodnight'
    let start = a ? '762+St+Marks+Avenue+Brooklyn+NY' : 'amplify+brooklyn+NY'
    let end = a ? 'amplify+brooklyn+NY' : '762+St+Marks+Avenue+Brooklyn+NY'

    // fetching good morning gif
    fetch(`https://api.giphy.com/v1/gifs/search?q=${timeOfDay}&api_key=aA6ywK8HyQvrwnwEOxwBFcu9tPiSXvIg`)
        .then(res => res.json())
        .then(res => res.data[Math.floor(Math.random() * res.data.length)])
        .then(res => res.id)
        .then(url => dispatch(getGif(url)))
        .catch(console.error)

    // fetching current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=5128581&APPID=${process.env.REACT_APP_WEATHER_KEY}`)
        .then(res => res.json())
        .then(data => {
            let weatherInfo = {currentTemp: getDegrees(data.main.temp), isRaining: data.rain ? true : false, isCold: checkCold(data)}
            return weatherInfo
        })
        .then(data => dispatch(weatherInfo(data)))
        .catch(console.error)

    // fetching precipitation forecase
    fetch(`https://api.openweathermap.org/data/2.5/forecast?id=5128581&APPID=${process.env.REACT_APP_WEATHER_KEY}`)
        .then(res => res.json())
        .then(data => data.list.slice(0,5).filter(el => el.snow && el.snow['3h'] > .5 || el.rain && el.rain['3h'] > .5))
        .then(arr => dispatch(precipInfo(arr.length > 0)))
        .catch(console.error)
        
    // fetching directions 
    let proxy = 'https://cors-anywhere.herokuapp.com/'
    let target = `https://maps.googleapis.com/maps/api/directions/json?&mode=transit&transit_routing_preference=fewer_transfers&origin=${start}&destination=${end}&key=${process.env.REACT_APP_MAP_KEY}`
    fetch(proxy + target)
        .then(res => res.json())
        .then(data => {
            let stations = [];
            let icons = [];
            data.routes[0].legs[0].steps.forEach((step,i) => {
                if(i%2 > 0){
                stations.push(step.transit_details.arrival_stop.name.split(' Subway Station')[0])
                icons.push(step.transit_details.line.icon.split('//')[1])
                }
            })

            let info = {icon: icons, station: stations, duration: data.routes[0].legs[0].duration.text}
            dispatch(transitInfo(info))
        })
        .catch(console.error)
}

// utility functions
const getDegrees = (K) => Math.floor(1.8 * (K - 273) + 32)

const checkCold = (data) => {
    let temp = getDegrees(data.main.temp)
    let coldScore = 0
    // is it windy?
    if(data.wind.speed >= 6) coldScore += 5 
    // is it raining
    if(data.rain) coldScore += 3
    // is the temperature low?
    if(temp < 60) coldScore += 10
    else if(temp > 60 && temp < 70) coldScore += 5
    return coldScore
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;



