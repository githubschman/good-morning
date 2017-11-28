import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';


export const checkPassword = password => ({type: 'LOG_IN', password})
export const getGif = url => ({type: 'GM_GIF', url})
export const weatherInfo = info => ({type: 'WEATHER_INFO', info})
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
            let needUmbrella = action.info.isRaining ? true : false;
            return Object.assign({}, state, {jacketIndex: action.info.isCold, needUmbrella: needUmbrella, temp: action.info.currentTemp})
        }
        case 'TRANSIT_INFO' : {
            return Object.assign({}, state, {travel: action.info})
        }
		default: {
			return state
		}
	}
}



export const fetchInfo = () => dispatch => {
    
    // fetching good morning gif
    fetch('https://api.giphy.com/v1/gifs/search?q=morning&api_key=aA6ywK8HyQvrwnwEOxwBFcu9tPiSXvIg')
        .then(res => res.json())
        .then(res => res.data[Math.floor(Math.random() * res.data.length)])
        .then(res => res.id)
        .then(url => dispatch(getGif(url)))
        .catch(console.error)

    // fetching weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=5095611&APPID=${process.env.REACT_APP_WEATHER_KEY}`)
        .then(res => res.json())
        .then(data => {
            let weatherInfo = {currentTemp: getDegrees(data.main.temp), isRaining: data.rain ? true : false, isCold: checkCold(data)}
            return weatherInfo
        })
        .then(data => dispatch(weatherInfo(data)))
        .catch(console.error)

    // fetching directions 
    var proxy = 'https://cors-anywhere.herokuapp.com/'
    var target = `https://maps.googleapis.com/maps/api/directions/json?origin=227+hardenburgh+ave+demarest+NJ&destination=1+Normal+Avenue+upper+Montclair+NJ&key=${process.env.REACT_APP_MAP_KEY}`
    fetch(proxy + target)
        .then(res => res.json())
        .then(data => {
            let info = {duration: data.routes[0].legs[0].duration.text}
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
    if(temp < 45) coldScore += 10
    else if(temp > 45 && temp < 60) coldScore += 5
    return coldScore
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;



