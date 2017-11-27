import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { checkPassword } from './store'

import './App.css';

class App extends Component {

  constructor(){

  super()
    this.state = {
      password: ''
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
    return (
      <div className="App">
        {this.props.loggedIn ? <h1> you are logged in </h1> : 
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
      loggedIn: state.loggedIn
  }
};

const dispatchToProps = function (dispatch) {
  return {
      inputPassword(password) {
          dispatch(checkPassword(password))
      }
  }
};

export default connect(stateToProps, dispatchToProps)(App);
