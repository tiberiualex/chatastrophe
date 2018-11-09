import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import './app.css';
import LoginContainer from './LoginContainer';
import ChatContainer from './ChatContainer';
import UserContainer from './UserContainer';

class App extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.props.history.push('/login');
      }
    });

    firebase
      .database()
      .ref('/messages')
      .on('value', snapshot => {
        console.log('here');
        console.log(snapshot);
      });
  }

  handleSubmitMessage = msg => {
    const data = {
      msg,
      author: this.state.user.email,
      user_id: this.state.user.uid,
      timestamp: Date.now()
    };

    firebase
      .database()
      .ref('messages/')
      .push(data)
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div id="container" className="inner-container">
        <Route path="/login" component={LoginContainer} />
        <Route
          exact={true}
          path="/"
          render = {() => <ChatContainer onSubmit={this.handleSubmitMessage} />} />
        <Route path="/users/:id" component={UserContainer} />
      </div>
    );
  }
}

export default withRouter(App);
