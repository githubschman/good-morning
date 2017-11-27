import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

export const checkPassword = password => ({type: 'LOG_IN', password})

let initialState = {
    passwordText: '',
    isRaining: false,
    temp: 0,
    loggedIn: false
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
		default: {
			return state
		}
	}
}


// fetch('https://api.darksky.net/forecast/' + process.env.REACT_APP_WEATHER_KEY + '/40.7128,-74.0060).then((response) => response.json()).then((res) => {

//     let weekly = [[res.daily.data[0].icon, Math.floor(res.daily.data[0].temperatureMax)], [res.daily.data[1].icon, Math.floor(res.daily.data[1].temperatureMax)], [res.daily.data[2].icon, Math.floor(res.daily.data[2].temperatureMax)]]
//     this.weather = {temp: Math.floor(Math.round(10 * res.currently.temperature)/10), sun: res.currently.summary.toLowerCase().split(' ').join(''), forecast: {summary, weekly}}
// })
// .catch(console.error)


const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;