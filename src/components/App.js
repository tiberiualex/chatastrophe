import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import './app.css';
import LoginContainer from './LoginContainer';
import ChatContainer from './ChatContainer';
import UserContainer from './UserContainer';

class App extends Component {
  state = { user: null, messages: [], messagesLoaded: false };

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
        this.onMessage(snapshot);
        if (!this.state.messagesLoaded) {
          this.setState({ messagesLoaded: true })
        }
      });
  }

  onMessage = snapshot => {
    const values = snapshot.val();

    const messages = Object.keys(values).map(key => {
      const msg = values[key];
      msg.id = key;
      return msg;
    });

    this.setState({ messages });
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
          render = {() => (
            <ChatContainer
              onSubmit={this.handleSubmitMessage}
              messages={this.state.messages}
              messagesLoaded={this.state.messagesLoaded}
              user={this.state.user} 
            />)
          }
        />
        <Route
          path="/users/:id"
          render={({ history, match }) => (
            <UserContainer
              messages={this.state.messages}
              messagesLoaded={this.state.messagesLoaded}
              userID={match.params.id} 
            />
          )} 
        />
      </div>
    );
  }
}

export default withRouter(App);
