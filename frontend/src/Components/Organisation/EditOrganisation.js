import React, { Fragment } from 'react';
import ReactToPrint from "react-to-print";
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, withMobileDialog, DialogTitle} from 'material-ui/Dialog';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { editOrganisation } from '../../actions/postData';
import OrganisationForm from './OrganisationForm';
import orgHelpers from './orgHelpers';
import Spinner from '../Spinner';
import './edit-org.css';

class EditOrganisation extends React.Component {
    state = {
      notificationSystem: null,
      open: false,
      Organisation: "",
      Area: "",
      Borough: "",
      Services: [],
      Process: "",
      Day: [],
      Tel: "",
      Email: "",
      Website: "",
      Categories: [],
      originalCategory: "",
      project: '',
      tag: '',
      postcode: '',
      clients: '',
      orgId: null,
      branchId: null,
      serviceId: null,
      addressId: null,
      isChecked: true,
      isLoading: false
    }

  componentWillMount() {
    const data = this.props.org;
    if (data) {
      const categories = [];
      const { checkCategories } = orgHelpers;
      // Data.cat_name.length is 1 => all category represents a single item
      // So made a new array where each category is an individual item of the array
      for (let i = 0; i < checkCategories.length; i += 1) {
        const index = data.cat_name.includes(checkCategories[i]);
        if(index){
          categories.push(checkCategories[i]);
        }
      }

      if (data.cat_name.includes('Young People/Children') || data.cat_name.includes('Young People and Children')){
        categories.push('Young People/Children');
      }
      this.setState({
        branchId: data.branch_id,
        orgId: data.org_id,
        serviceId: data.service_id,
        addressId: data.address_id,
        Organisation: data.org_name,
        Area: data.area,
        Borough: data.borough,
        Services: data.service,
        Process: data.process,
        Day: data.service_days.split(','),
        Tel: data.telephone,
        Email: data.email_address,
        Website: data.website,
        Categories: [...new Set(categories)],
        originalCategory: data.cat_name,
        project: data.project,
        tag: data.tag,
        postcode: data.postcode,
        clients: data.clients
      })
    }
  }

  componentDidMount() {
    this.setState({
      notificationSystem: this.refs.savedChanges
    })
  }

  savedChangesSuccessfully = (message) => {
    this.state.notificationSystem.addNotification({
      title: 'Success',
      message,
      level: 'success',
    });
  }

  unSucessSavedChanges = (message) => {
    this.state.notificationSystem.addNotification({
      title: 'Unsuccess',
      message,
      level: 'error',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const days = this.state.Day.join(' ');
    const categories = this.state.Categories;
    const orgData = {
      branchId: this.state.branchId,
      serviceId: this.state.serviceId,
      addressId: this.state.addressId,
      orgId: this.state.orgId,
      organisation: this.state.Organisation,
      area: this.state.Area,
      borough: this.state.Borough,
      service: this.state.Services,
      process: this.state.Process,
      days: days,
      tel: this.state.Tel,
      email: this.state.Email,
      website: this.state.Website,
      categories: categories,
      originalCategory: this.state.originalCategory,
      address: "not provided",
      lat: "not provided",
      long: "not provided",
      postcode: this.state.postcode,
      project: this.state.project,
      clients: this.state.clients,
      tag: this.state.tag
    }

    this.setState({ isLoading: true });
    this.props.editOrganisation(orgData)
      .then(user => {
        if (user && user.success !== false) {
          this.savedChangesSuccessfully(user.message)
          this.setState({ open: false, isLoading: false })
          this.context.router.history.push(`${this.props.location.pathname}`)
        } else {
          this.unSucessSavedChanges(user.message)
          this.setState({isLoading: false })
        }
      });
  };

  handleFieldUpdate = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };


  handleCheckBox = event => {
    const listOfCategories = [...this.state.Categories];
    orgHelpers.handleCheckBoxProcess(event, listOfCategories);
    this.setState({
      [event.target.name]: event.target.checked,
      Categories: [...new Set(listOfCategories)],
    });
  };

  // Default checkbox selected
  handleDefaultCheckbox = event => {
    const listOfCategories = [...this.state.Categories];
    orgHelpers.handleDefaultCheckboxProcess(event, listOfCategories);
    this.setState({
      [event.target.name]: event.target.value,
      Categories: [...new Set(listOfCategories)],
      isChecked:!this.state.isChecked,
    });

   };


  handleMulitySelectChange = event => {
    this.setState({ Day: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpenComponent = () => {
    this.setState({ open : true })
  }

  render() {
    const checkedCategory = this.state.Categories;
    if (this.state.isLoading) {
      return <Spinner color='blue' bgColor='spinnerEdit' />;
    }
    return (
      <Fragment>
        <div className="org-edit-btn">
          <Button className="btn edit-button" onClick={this.handleOpenComponent}>
            <i className="material-icons" size="small" variant="raised" >edit</i>EDIT
          </Button>
        </div>
        <NotificationSystem ref="savedChanges" />
        <Dialog
          className="edit-org"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
          modal="true"
          autodetectwindowheight="true"
          autoscrollbodycontent="true"
          contentstyle={{width: 100, maxWidth: "none"}}
        >
          <DialogTitle id="form-dialog-title" className="edit-org-title">
            <div> {""}</div>
            <div className="org-close-btn">
              <Button
                onClick={this.handleClose}
                className="close-button"
              >
                <i className="material-icons" size="small" variant="raised">close</i>
              </Button>
            </div>
          </DialogTitle>
          <DialogContent
            className="edit-content"
            ref={el => {
                (this.componentRef=el)
                return this.componentRef
                }}
          >
            <ReactToPrint
              trigger={() => <i className="material-icons" > print </i>}
              content={() => this.componentRef}
            />
            <OrganisationForm
              edit
              name={this.state.Organisation}
              service={this.state.Services}
              area={this.state.Area}
              selectedArea={this.state.Area}
              borough={this.state.Borough}
              selectedBorough={this.state.Borough}
              process={this.state.Process.replace(/(\r\n\s|\n|\r|\s)/gm, ' ')}
              day={this.state.Day}
              telephone={this.state.Tel}
              email={this.state.Email}
              website={this.state.Website}
              project={this.state.project}
              tag={this.state.tag}
              postcode={this.state.postcode}
              clients={this.state.clients}
              checkedCategory={checkedCategory}
              openSelect={this.state.openSelect}
              closeSelect={this.handleClose}
              handleMulitySelectChange={this.handleMulitySelectChange}
              formType="edit-org"
              handleCheckBox={this.handleCheckBox}
              onChangeCheckbox={this.handleCheckbox}
              onChange={this.handleFieldUpdate}
              check={this.state.isChecked}
              handleDefaultCheckbox={this.handleDefaultCheckbox}
              close={this.handleClose}

            />
          </DialogContent >
          <DialogActions className="edit-mode-btn">
            <Button
              className="cancel-btn"
              onClick={this.handleClose}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              className="save-btn"
              onClick={this.handleSubmit}
              color="primary"
              size="small"
              autoFocus
            >
              save changes
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditOrganisation.propTypes = {
  editOrganisation: PropTypes.func.isRequired
};

EditOrganisation.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default withMobileDialog()(connect(null, { editOrganisation })(withRouter(props => <EditOrganisation {...props} />)));
