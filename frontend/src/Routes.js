import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import OrganisationCard from './Components/Organisation';
import AddOrganisation from './Components/Organisation/AddOrganisation';
import LandingPage from './Components/LandingPage';
import SideBar from './Components/SideBar';
import Users from './Components/Users';
import HomePage from './Components/HomePage';
import AuthEndpoint from './utils/AuthEndpoint';
import Reset from './Components/Users/forgot-password/Reset'
import Request from './Components/Users/Request';
import Verify from './Components/Verify';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    overflow: 'auto',
  },
});

const Routes = props => {
  const { classes } = props;
  const showSideBar = props.location.pathname !== '/' && props.location.pathname.substring(0,9) !== '/verified' ;
  return (
    <div>
      <Route exact path="/verified/:verified" component={Verify} />
      <div className={classes.root}>
        {showSideBar ? <SideBar /> : null}
        <Route exact path="/" component={LandingPage} />
        <main
          className={classes.content}
        >
          <div className={classes.drawerHeader} />
          <Route exact path="/reset" component={AuthEndpoint(Reset)} />
          <Route exact path="/reset/:token" component={Reset} />
          <Route exact path="/:home" component={AuthEndpoint(HomePage)} />
          <Route
            exact
            path="/services/:service"
            component={AuthEndpoint(OrganisationCard)}
          />
          <Route
            exact
            path="/services/:service/add"
            component={AuthEndpoint(AddOrganisation)}
          />
          <Route exact path="/admindos" component={AuthEndpoint(Users)} />
          <Route exact path="/users/form" component={AuthEndpoint(Users)} />
          <Route exact path="/user/profile" component={AuthEndpoint(Users)} />
          <Route exact path="/user/request" component={AuthEndpoint(Request)} />
          <Route exact path="/accept" component={AuthEndpoint(Users)} />
        </main>
      </div>
    </div>
  );
};


SideBar.propTypes = {
  theme: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(
  withRouter(props => <Routes {...props} />),
);
