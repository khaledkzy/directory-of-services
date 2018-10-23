import React from 'react';
import { Link } from 'react-router-dom';
import './users.css';

const UsersMenu = () => (
  <div className="users-menu">
    <Link to="/admindos" role="button" className="menu-header">
      Users
    </Link>
    <Link to="/users/form" role="button">
      Add
    </Link>
    <a href="https://goo.gl/D3vBp1" target="blank">Please Give Feedback</a>
  </div>
);

export default UsersMenu;
