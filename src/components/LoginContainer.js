import React, { Component } from 'react';
import Header from './Header';

class LoginContainer extends Component {
  state = { email: '', password: '', state: '' };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState( { password: e.target.value });
  };

  onLogin() {
    this.props.history.push('/');
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        this.onLogin();
      })
      .catch(err => {
        if (err.code === 'auth/user-not-found') {
          this.signup();
        } else {
          this.setState({ error: 'Error logging in' })
        }
      });
  }

  signup() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        this.onLogin();
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: 'Error signing up' });
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ error: '' });
    if (this.state.email && this.state.password) {
      this.login();
    } else {
      this.setState({ error: 'Please fill in both fields.' })
    }
  };

  render() {
    return (
      <div id="LoginContainer" className="inner-container">
        <Header />
        <form onSubmit={this.handleSubmit}>
          <p>Sign in or sign up by entering your email and password.</p>
          <input
            type="text"
            placeholder="Your email"
            onChange={this.handleEmailChange}
            value={this.state.email} />
          <input
            type="password"
            placeholder="Your password"
            onChange={this.handlePasswordChange} 
            value={this.state.password} />
          <p className="error">{this.state.error}</p>
          <button className="red light" type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginContainer;