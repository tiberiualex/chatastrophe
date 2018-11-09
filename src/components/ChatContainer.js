import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
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

  getAuthor = (msg, nextMsg) => {
    if (!nextMsg || nextMsg.author !== msg.author) {
      return (
        <p className="author">
          <Link to={`/users/${msg.user_id}`}>{msg.author}</Link>
        </p>
      );
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.messages.length !== this.props.messages.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    const messageContainer = ReactDOM.findDOMNode(this.messageContainer);
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  render() {
    return (
      <div id="ChatContainer" className="inner-container">
        <Header>
          <button onClick={this.handleLogout} className="red">Logout</button>
        </Header>

        {this.props.messagesLoaded ? (
          <div id="message-container"
            ref={element => { this.messageContainer = element; }}>
            {this.props.messages.map((msg, i) => (
              <div key={msg.id} className={`message ${this.props.user.email === msg.author && 'mine'}`}>
                <p>{msg.msg}</p>
                {this.getAuthor(msg, this.props.messages[i+1])}
              </div>
            ))}
          </div>
        ) : (
          <div id="loading-container">
            <img src="/assets/icon.png" alt="logo" id="loader" />
          </div>
        )}

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
