import React, { Component } from 'react';
import Header from './Header';

class ChatContainer extends Component {
  state = { newMessage: '' }

  handleLogout = () => {
    firebase.auth().signOut();
  }

  handleInputChange = event => {
    this.setState({ newMessage: event.target.value });
  }

  handleKeyDown = event => {
    if (event.key == 'Enter') {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  handleSubmit = event => {
    this.props.onSubmit(this.state.newMessage);
    this.setState({ newMessage: '' })
  }

  render() {
    return (
      <div id="ChatContainer" className="inner-container">
        <Header>
          <button onClick={this.handleLogout} className="red">Logout</button>
        </Header>
        <div id="message-container">
        
        </div>
        <div id="chat-input">
          <textarea 
            value={this.state.newMessage}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Add your message..." />
          <button onClick={this.handleSubmit}>
            <svg viewBox="0 0 24 24">
              <path fill="#424242" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

export default ChatContainer;
