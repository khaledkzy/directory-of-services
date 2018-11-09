import React, { Component, Fragment } from 'react';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import TopNav from '../TopNav';
import { requestAccess , rejectAccessByEmail } from '../../actions/loginActions';
import './Request.css'

class Request extends Component{
    state = {
        notificationSystem: null,
        requested: false,
        canceled: false,
    }
    componentDidMount() {
        this.setState({
          notificationSystem: this.refs.notificationSystem,
        })
    }

    handleSubmit= (e)=> {
        const {email} = this.props
        this.props.requestAccess(email)
        e.preventDefault();
        this.setState({
            requested: true
          })
        this.state.notificationSystem.addNotification({
            message: 'Please Check your email',
            level: 'success',
            position: 'tr',
            autoDismiss: 2,
          });
    }
    handleReject = (email, event) => {
      event.preventDefault();
      this.props.rejectAccessByEmail(email);
      this.setState({
        canceled: true
      })
      this.state.notificationSystem.addNotification({
        message: 'You have successfully cancelled your request',
        level: 'info',
        position: 'tr',
        autoDismiss: 2,
      });
    };
    render() {
        return(
          <Fragment>
            <TopNav title="USERS" addLink="users/form" titleLink="users" />
            { this.state.requested === false && this.props.hasRequestedEditor === false &&
            <Fragment>
              <h2 className="request" >If you want to become an editor please click <button className="button" onClick={this.handleSubmit} > here</button> </h2>
            </Fragment>
           }
            {this.state.requested === true &&
            <div>
              <h2 className="request">Please Check your email</h2>
            </div>
           }
            {this.state.canceled === false && this.props.hasRequestedEditor  && this.props.rejected === false &&
            <div>
              <h2 className="request">Awaiting for Approval --  If you want to cancel please click   <button  className="button" onClick={(event) => this.handleReject(this.props.email,event)} >here.</button></h2>
            </div>
           }
            {this.props.rejected &&  this.props.hasRequestedEditor === false &&
            <div>
              <h2 className="request">Dear {this.props.name} --  You request has been rejected by the admin </h2>
            </div>
           }
            <NotificationSystem ref="notificationSystem" />
          </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
    email: state.loginAuth.user.email,
    hasRequestedEditor: state.loginAuth.user.hasRequestedEditor,
    rejected: state.loginAuth.user.rejectedByAdmin,
    name: state.loginAuth.user.fullname,
    users: state.listOfUsers.users
    };
  }
export default connect (mapStateToProps, { requestAccess, rejectAccessByEmail })(Request);

