import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { blue50 } from 'material-ui/styles/colors';
import { checkPassword, fetchInfo } from './store'
import moment from 'moment';
import './App.css';
import sun from './sun.png'
import moon from './moon.png'

class App extends Component {

  constructor(){

  super()
    this.state = {
      password: '',
      hideGif: true,
      workday: true,
      greeting: '',
      a: true
    }
  }
  
  componentDidMount(){
    let day = moment().format('dddd');
    let a = moment().format('a') === 'am'
    let greetingArray;
    a ? greetingArray = ['Bom Dia', 'Buenos días', 'Guten Morgen', 'God morgen', 'Bonjour', 'Joh-eun achim']
      : greetingArray = ['Bonne nuit', 'Goedenacht', 'Buonanotte', 'Oyasumi'];
    let num = Math.floor(Math.random() * greetingArray.length)
    this.setState({a, greeting: greetingArray[num], workday: day === 'Saturday' || day === 'Sunday' ? false : true})
  }

  componentWillReceiveProps(newProps) {
    if(newProps.loggedIn !== this.props.loggedIn && newProps.loggedIn){
      this.props.init(this.state.a)
    }
  }

  handleInput = (e) => {
    e.preventDefault();
    this.setState({password: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.inputPassword(this.state.password);
    this.setState({password: ''});
  }


  render() {

    let jacketText;
    if(this.props.jacketIndex > 7){
      jacketText = 'definitely'
    }else if (this.props.jacketIndex < 7 && this.props.jacketIndex > 4){
      jacketText = 'probably'
    }else{
      jacketText = 'not'
    }

    let transit = this.props.travel

    return (
      <div className="App">
        {this.props.loggedIn && this.state.workday ?
            <div>
              <h1>{this.state.greeting}, Sarah!</h1>
              {this.state.hideGif ? <RaisedButton onClick={() => this.setState({hideGif: false})} label="gif me!" primary={true} style={{margin: 12}}/> :
              <iframe title={'good morning gif'} src={`https://giphy.com/embed/${this.props.gif}`} width="300" frameBorder="0" allowFullScreen></iframe>           
              }
              <h2>It is {this.props.temp} degrees out.</h2>
              <h2>You will {jacketText} need a jacket today.</h2>
              {this.props.needUmbrella ? <h2> Pack your umbrella! ☔️ </h2> : null}
              <h2>Take the <img src={`http://${transit.icon}`} /> to {transit.station}.</h2>
              <h2>Transit will take {transit.duration}.</h2>
            </div> 

          : 
      
          <div>
          <h1>{this.state.a ? `Top of the mornin'!` : 'Good evening!'}</h1>
          <img className={'logo'} src={this.state.a ? sun : moon} />
          <form onSubmit={this.handleSubmit}>
            <TextField
                hintText="enter your password"
                hintStyle={{color: blue50}}
                type="password"
                onChange={this.handleInput}
                value={this.state.password}
                underlineFocusStyle={{borderColor: blue50}}
            />
            <RaisedButton type="submit" label="enter" style={{margin: 12}}/>  
            <h2> {this.props.passwordText} </h2>        
          </form>
          
        </div>
        }

        {this.props.loggedIn && !this.state.workday ? <div><h1>Have a great weekend, Sarah</h1></div> : null}
      </div>
    );
  }
}

const stateToProps = function (state) {
  return {
      passwordText: state.passwordText,
      loggedIn: state.loggedIn,
      gif: state.gif,
      needUmbrella: state.needUmbrella,
      jacketIndex: state.jacketIndex,
      temp: state.temp,
      travel: state.travel
  }
};

const dispatchToProps = function (dispatch) {
  return {
      inputPassword(password) {
        dispatch(checkPassword(password))
      },
      init(){
        dispatch(fetchInfo())
      }
  }
};

export default connect(stateToProps, dispatchToProps)(App);