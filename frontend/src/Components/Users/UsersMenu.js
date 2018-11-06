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
  </div>
);

export default UsersMenu;
