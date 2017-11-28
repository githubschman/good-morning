import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { checkPassword, fetchInfo } from './store'
import moment from 'moment';

import './App.css';

class App extends Component {

  constructor(){

  super()
    this.state = {
      password: '',
      hideGif: true,
      workday: true,
      am: true
    }
  }
  
  componentDidMount(){
    let day = moment().format('dddd');
    let amCheck = moment().format('a') === 'am'
    this.setState({am: amCheck, workday: day === 'Saturday' || day === 'Sunday' ? false : true})
  }

  componentWillReceiveProps(newProps) {
    if(newProps.loggedIn !== this.props.loggedIn && newProps.loggedIn){
      this.props.init()
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
        {this.props.loggedIn && this.state.workday ? // add am check
            <div>
              <h1>Good Morning, Sarah!</h1>
              {this.state.hideGif ? <RaisedButton onClick={() => this.setState({hideGif: false})} label="gif me!" primary={true} style={{margin: 12}}/> :
              <iframe title={'good morning gif'} src={`https://giphy.com/embed/${this.props.gif}`} width="480" height="270" frameBorder="0" allowFullScreen></iframe>           
              }
              <h2>It is {this.props.temp} degrees out.</h2>
              <h2>You will {jacketText} need a jacket today.</h2>
              {this.props.needUmbrella ? <h2> Pack your umbrella! </h2> : null}
              <h2>Take the <img src={`http://${transit.icon}`} /> to {transit.station}.</h2>
              <h2>Transit will take {transit.duration}.</h2>
            </div> 

          : 
      
          <div>
          <form onSubmit={this.handleSubmit}>
            <TextField
                hintText="enter your password"
                type="password"
                onChange={this.handleInput}
                value={this.state.password}
            />
            <RaisedButton type="submit" label="enter" primary={true} style={{margin: 12}}/>          
          </form>
          <p> {this.props.passwordText} </p>
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


/*
{this.state.am ? 
  <div>
    <h1>Have a great day, Sarah!</h1>
  </div>
  :
  null
}
*/