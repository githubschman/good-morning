import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { checkPassword, fetchInfo } from './store'

import './App.css';

class App extends Component {

  constructor(){

  super()
    this.state = {
      password: ''
    }
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
        {this.props.loggedIn ? 
          <div>
            <h1>Good Morning, Sarah!</h1>
            <iframe title={'good morning gif'} src={`https://giphy.com/embed/${this.props.gif}`} width="480" height="270" frameBorder="0" allowFullScreen></iframe>          
            <h1>It is {this.props.temp} degrees out.</h1>
            <h1>You will {jacketText} need a jacket today.</h1>
            {this.props.needUmbrella ? <h1> Pack your umbrella! </h1> : null}
            <h1>Take the <img src={`http://${transit.icon}`} /> to {transit.station}.</h1>
            <h1>Transit will take {transit.duration}.</h1>
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
