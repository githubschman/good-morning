import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
const fetchMixins = require('fetch-cors-mixins');


export const checkPassword = password => ({type: 'LOG_IN', password})
export const getGif = url => ({type: 'GM_GIF', url})

let initialState = {
    passwordText: '',
    isRaining: false,
    temp: 0,
    loggedIn: false,
    gif: ''
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
		default: {
			return state
		}
	}
}

export const fetchInfo = () => dispatch => {
    
    // fetches good morning gif
    fetch('http://api.giphy.com/v1/gifs/search?q=morning&api_key=aA6ywK8HyQvrwnwEOxwBFcu9tPiSXvIg')
        .then(res => res.json())
        .then(res => res.data[Math.floor(Math.random() * res.data.length)])
        .then(res => res.id)
        .then(url => dispatch(getGif(url)))
        .catch(console.error)

    fetch(`http://api.wunderground.com/api/${process.env.REACT_APP_WEATHER_KEY}/conditions/q/CA/San_Francisco.json`, fetchMixins)
        .then(res => res.json())
        .then(res => {
console.log(res)
        })
        .catch(console.error)


}



const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;



