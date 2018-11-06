import React, { Fragment, Component } from 'react';
import TextField from 'material-ui/TextField';
import NotificationSystem from 'react-notification-system';
import Button from 'material-ui/Button';
import axios from 'axios';
import './user-table.css';

class AddUser extends Component {
  state = {
    email: '',
    message: `
    Hi, 
    This is an invitation to join the NGO Service Directory, where you will be able to search information 
    on organisations supporting refugees and other people in need.`,
    notificationSystem: null,
  };

  componentDidMount() {
    this.setState({
      notificationSystem: this.refs.savedChanges, 
    });
  }

  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  
  savedChangesSuccessfully = (message) => {
    this.state.notificationSystem.addNotification({
      title: 'Success',
      message,
      level: 'success',
    });
  };

  failedSavedChanges = (message) => {
    this.state.notificationSystem.addNotification({
      title: 'Unsuccess',
      message,
      level: 'error',
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { email, message } = this.state;
    const api = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCALHOST_API_URL;
    try {
      const info = await axios.post(`${api}/invite`, ({email, message}));
      this.setState({
        email: '',
      })
      this.savedChangesSuccessfully(info.data.message)
    } catch(err) {
      this.failedSavedChanges('Your message was not send please try again')
      return err
    };
  };

  render() {
    const { email, message } = this.state;
    const disableBtn = /\S+@\S+\.\S+/.test(email) ;
    return (
      <Fragment>
        <form className="add-user">
          <NotificationSystem ref="savedChanges" />
          <div className="add-message">
            <TextField
              required
              label="Email"
              id="filled-full-width"
              placeholder="Email"
              name="email"
              value={email}
              onChange={this.onChangeHandler}
              margin="normal"
              helperText="If you send invitation to more than one person use comma to seperate email"
              variant="filled"
              InputLabelProps={{
                shrink: true,
                className: 'email',
              }}
            />
          </div>
          <div className="add-message message">
            <TextField
              required
              label="Message"
              id="filled-full-width"
              placeholder="I'm working on this project and wanted to share it with you! Please include your detail so that the receiver can identify you."
              helperText="Please enter a message before you send. Please include your detail so that the receiver can identify you"
              multiline
              name="message"
              value={message}
              onChange={this.onChangeHandler}
              margin="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true,
                className: 'message',
              }}
            />
          </div>
          <Button
            disabled={!disableBtn}
            variant="raised"
            size="small"
            type="submit"
            className="add-user-button"
            onClick={this.handleSubmit}
          >
            send invitation
          </Button>
        </form>
      </Fragment>
    );
  }
}

export default AddUser;
