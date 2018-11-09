import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

class UserContainer extends Component {
  render() {
    return (
      <div id="UserContainer">
        <Header>
          <Link to="/">
            <button className="red">Back to chat</button>
          </Link>
        </Header>
      </div>
    );
  }
}

export default UserContainer;
