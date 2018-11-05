import React, {Component, Fragment } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './user-drop-down.css';
import './users.css';
import BubbleIcon from '../TopNav/BubbleIcon'
import {  getListOfUsers } from '../../actions/getApiData';


class UserDropDown extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.props.getListOfUsers();
  }

  componentWillReceiveProps(newProps) {
    const users = newProps.usersList;
    if (users) {
      this.setState({
        data: users,
      })
    }
  }

 render(){
    const { data } = this.state;
    const usersList = data.length > 1 ? data : this.props.usersList;
  return(
    <div className="user-drop-down">
      <Paper className="container">
        <Link to="/user/profile">
          <i className="material-icons">perm_contact_calendar</i>
          <h4>Profile</h4>
        </Link>
        <Divider />
        <Divider />
        {this.props.role === 'Admin' &&
        <Fragment>
          <Link to="/admindos">
            <img src="https://png.icons8.com/material/24/1abcd4/businessman.png" alt="admin-icon" />
            <h4 className="admin">Users</h4>
          </Link>
        </Fragment>
      }
        {this.props.role === 'Admin'  && {usersList} &&
        <Fragment>
          <Divider />
          <Link to="/accept">
            <img className="accept-icon" src="/img/accept.png" alt="admin-icon" />
            <h4 className={["admin", "accept"].join(' ')}>Review Request
              <span >
                <BubbleIcon  />
              </span>
            </h4>
          </Link>
          <Divider />
        </Fragment>
      }
        <Link to="/">
          <button
            onClick={this.props.handleLogOut}
          >
            <i className="material-icons">lock_outline</i>
            <h4 >Logout</h4>
          </button>
        </Link>
      </Paper>
    </div>
  )
    }
  }
  function mapStateToProps(state) {
    return {
      usersList: state.listOfUsers
    };
  }
  export default connect(mapStateToProps, {getListOfUsers})(UserDropDown);