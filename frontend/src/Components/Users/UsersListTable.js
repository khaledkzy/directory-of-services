import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Save from 'material-ui-icons/Save';
import NotificationSystem from 'react-notification-system';
import Notification from './Notification';

import { upDateUser} from '../../actions/loginActions';

import UsersTableHead from './UsersTableHead';
import './user-table.css';

class UsersListTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fullname: '',
      organisation: '',
      role: '',
      id: '',
      order: 'asc',
      orderBy: 'fullname',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      editIdx: -1,
      notificationSystem: null,
    };
  }

  
  componentDidMount() {
    this.setState({
      notificationSystem: this.refs.savedChanges,
    });
  }

  componentWillReceiveProps (newProps) {
    const users = newProps.usersList;
    if(users) {
      this.setState({
        data: users,
      })
    }
    
  }

  savedChangesSuccessfully = (message) => {
    this.state.notificationSystem.addNotification({
      title: 'Success',
      message, 
      level: 'success',
    });
  };

  unSucessSavedChanges = message => {
    this.state.notificationSystem.addNotification({
      title: 'Unsuccess',
      message,
      level: 'error',
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      fullname: this.state.fullname,
      role: this.state.role,
      organisation: this.state.organisation,
      id:this.state.id
    };
    this.props.upDateUser(data)
    .then(user => {
      if(user && user.success) {
        this.savedChangesSuccessfully(user.message);
        this.context.router.history.push('/admindos')
      } else {
        this.unSucessSavedChanges(user.message);
        
      }
    })
  };
  

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  startEditing = (index, data) => {
    this.setState({ 
      editIdx: index,
        fullname: data.fullname,
        organisation: data.organisation,
      role: data.role, 
    });
  };

  stopEditing = () => {
    this.setState({ editIdx: -1 }, this.savedChangesSuccessfully());
  };

  handleUserDataChange = (e, userId) => {
    const { value } = e.target;
    this.setState({
      [e.target.name]: value,
      id: userId,
    })
  };
  
  render() {
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const usersList = data.length > 1 ? data : this.props.usersList;
    const emptyRows = null;
    const { editIdx } = this.state; 
    
    return (
      <Fragment>
        <NotificationSystem ref="savedChanges" />
        <Table className="users-table">
          <UsersTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
            rowCount={data.length}
            params='Actions'
            usersList={usersList}
          />
          <TableBody className="users-tbody">
            {usersList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                const currentlyEditing = editIdx === row.id;
                return currentlyEditing ? (
                  <tr key={row.id}>
                    <TableCell className="user-text">
                      <TextField
                        name="fullname"
                        onChange={e => this.handleUserDataChange(e, row.id)}
                        value={this.state.fullname}
                      />
                    </TableCell>
                    <TableCell className="user-text">
                      <TextField
                        name="organisation"
                        onChange={e => this.handleUserDataChange(e, row.id)}
                        value={this.state.organisation}
                      />
                    </TableCell>
                    <TableCell className="user-text">
                      <FormControl className="form-control-filed">
                        <Select
                          open={this.state.open}
                          onClose={this.handleClose}
                          value={this.state.role}
                          onChange={e => this.handleUserDataChange(e, row.id)}
                          inputProps={{
                            name: 'role',
                            id: 'controlled-open-select',
                          }}
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Admin">Admin</MenuItem>
                          <MenuItem value="Editor">Editor</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell className="user-text">
                      <Button
                        variant="raised"
                        size="small"
                        type="submit"
                        className="edit-user-button"
                        onClick={this.handleSubmit}
                      >
                        <Save className="save" /> save
                      </Button>
                    </TableCell>
                  </tr>
              ) : (
                <TableRow key={row.id}>
                  <TableCell className="user-text">{row.fullname}</TableCell>
                  <Hidden xsDown>
                    <TableCell className="user-text">{row.organisation}</TableCell>
                  </Hidden>
                  <TableCell className="user-text">{row.role? row.role : 'None'}</TableCell>
                  {this.props.params === "/user/profile"? null :
                  <TableCell className="user-text">
                    <Button onClick={() => this.startEditing(row.id, row)} raised="true">
                      <i className="material-icons">edit</i>Edit
                    </Button>
                    <Notification
                      value={row.fullname}
                      title='USER'
                      userId={row.id}
                    />
                  </TableCell>}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 49 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
              )}
          </TableBody>
          {this.props.params !== "/user/profile" && 
            <TableFooter className="users-tfoot">
              <TableRow>
                <TablePagination
                  className="pagination-arrows"
                  colSpan={6}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          }
        </Table>
      </Fragment>
    );
  }
}

UsersListTable.PropsTypes = {
  upDateUser: PropTypes.func.isRequired
}

UsersListTable.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default connect (null, { upDateUser })(UsersListTable);
