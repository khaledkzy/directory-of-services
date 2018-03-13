import React, { Component } from 'react';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import './user-table.css';
import UsersTableHead from './UsersTableHead';

let counter = 0;
function createData(name, email, role) {
  counter += 1;
  return { id: counter, name, email, role };
}

const usersData = [
  createData('John  Apollo Kahn', 'john@gmail.com', 'Admin'),
  createData('Bob Latouche', 'bob@gmail.com', 'Admin'),
  createData('Richard Fox', 'foxn@gmail.com', 'Editor'),
  createData('Henry Park', 'park@gmail.com', 'Admin'),
  createData('Ginger Lucy', 'lucy@gmail.com', 'Editor'),
  createData('Alima Simpson', 'lima@gmail.com', 'Admin'),
  createData('Boris Bakman', 'boka@gmail.com', 'Editor'),
  createData('Alan William', 'will@gmail.com', 'Editor'),
  createData('John Kahn', 'john@gmail.com', 'Admin'),
  createData('Lamine Sakho', 'sakho@gmail.com', 'Editor'),
  createData('Nestor Paul', 'nestor@gmail.com', 'Editor'),
  createData('Alice Kolman', 'alice@gmail.com', 'Editor'),
  createData('Hilary Carmel', 'hilary@gmail.com', 'Editor'),
];

export default class UsersListTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      data: usersData,
      page: 0,
      rowsPerPage: 5,
    };
  }

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

  render() {
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Table className="users-table">
        <UsersTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={this.handleSelectAllClick}
          onRequestSort={this.handleRequestSort}
          rowCount={data.length}
        />
        <TableBody className="users-tbody">
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(n => (
              <TableRow key={n.id}>
                <TableCell className="user-text">{n.name}</TableCell>
                <TableCell className="user-text">{n.email}</TableCell>
                <Hidden xsDown>
                  <TableCell className="user-text">{n.role}</TableCell>
                  <TableCell className="user-text">
                    <Button raised><i className="material-icons">edit</i></Button>
                    <Button raised><i className="material-icons">delete</i></Button>
                  </TableCell>
                </Hidden>
              </TableRow>
            ))}
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
        <TableFooter>
          <TableRow>
            <TablePagination
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
      </Table>
    );
  }
}
