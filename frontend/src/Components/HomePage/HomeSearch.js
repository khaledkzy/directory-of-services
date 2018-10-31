import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Grid } from 'material-ui';
import { withRouter, Link } from 'react-router-dom';
import EditOrganisation from '../Organisation/EditOrganisation';
import SingleOrganisation from '../Organisation/SingleOrganisation';
import OrganisationCard from '../Organisation/OrganisationCard';
import { getBranchesFilteredByPostCode } from '../../actions/postData';
import helpers from '../../helpers';
import SearchForm from './SearchForm'
import Spinner from '../Spinner';
import './HomePage.css'
import homePageHelper from './homePageHelper';

class HomeSearch extends React.Component {
  state = {
    organisationsBeforFilterByPostcode: [],
    postcodeSuggestions: [],
    postcodeValue: '',
    organisations: [],
    suggestions: [],
    postcodes: [],
    postCode: '',
    editIdx: -1,
    search: '',
    value: '',
    postcodeError: '',
    isPostcode: false,
    isLoading: false,
    isHidden: true,
    sort: false,
    showLink: true,
  };

  componentWillReceiveProps(newProps) {
    const organisations = newProps.organisations
      ? newProps.organisations
      : [];
    const postcodes = newProps.organisations ? newProps.organisations
      .map(org => {
      const postcode = { postCode: org.postcode }
      return postcode;
      })
      .filter((elem, index, self) =>
        index === self.findIndex(orgs => orgs.postCode === elem.postCode)
      )
      : [];
      this.setState({ organisations, postcodes, organisationsBeforFilterByPostcode: organisations });
  }

  // allow user to press enter key for search
  handleKeyUp = (e) => {
    if (e.charCode === 13 || e.key === 'Enter') {
      if (this.state.value.trim().length !== 0 && this.state.postcodeError.trim().length !== 0){
          this.setState({postcodeError: ''});
          this.updateSearchData();
        } else if ((this.state.postCode.trim().length !== 0 && this.state.value.trim().length !== 0) ||
            (this.state.postCode.trim().length === 0 && this.state.value.trim().length !== 0) ||
            (this.state.postCode.trim().length !== 0 && this.state.value.trim().length === 0))  {
            this.updateSearchData();
        }
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: helpers.getMainSearchSuggestions(value, this.state.organisations)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  handleChange = (event, { newValue }) => {
    this.setState({ value: newValue, isHidden: false, });
  };

  editSelectedOrganisation = idex => this.setState({ editIdx: idex });

  stopEditing = () => {
    this.setState({ editIdx: -1 });
  };

  // clear input value
  clearSearchField = () => {
    this.setState({
      value: '',
      isHidden: true,
    })
  }

  clearPostcodeField = () => {
    const data = this.state.organisationsBeforFilterByPostcode
    this.setState({
      postCode: '',
      postcodeValue: '',
      isPostcode: false,
      organisations: data,
      postcodes: []
    })
  }

  handlePostSearch = async () => {
    if (this.state.postCode.length === 0) {
      return null;
    } else if (this.state.postCode.length < 5) {
      this.setState({
        postcodeError: 'The postcode you have entered is incorrect.',
        isLoading: false,
        postCode: '',
        postcodeValue: '',
       })
    } else {
      const post = this.state.postCode.replace(/[' ']/g, '');
      this.setState({ isLoading: true, postcodeError: '' })
      const data = await fetch(`https://api.postcodes.io/postcodes/?q=${post}`);
      const res = await data.json()
      if (res && res.result && res.status === 200) {
        this.setState({ isLoading: true, sort: true })
        res.result.map(async info => {
          const lat = info.latitude
          const long = info.longitude
          const getBranches = await this.props.getBranchesFilteredByPostCode({ lat, long })
          const orgsData = [];
          getBranches.data
            .map(branchs => {
              const { distance } = branchs;
              const orgs = branchs.data;
              return orgsData.push({ distance, ...orgs })
            })
          this.setState({ organisations: orgsData })
        })
        this.setState({ isLoading: false })
      } else {
        this.setState({
          postcodeError: 'The postcode you have entered is incorrect.',
          isLoading: false,
          postCode: '',
          postcodeValue: '',
        })
      }
    }
  }

  updateSearchData = () => {
    // Remove x sign uses to clear input when user start search(value)
    this.setState({ 
      search: this.state.value, 
      isHidden: true,
      postcodeValue: this.state.postCode, 
      isPostcode: false,
      showLink: false, 
      })

    this.handlePostSearch()
  }

  dataOrder = () => {
    if (!this.state.sort) {
      return helpers.sortArrObj
    }
    return (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
  }

  handleSuggestionsFetchRequestedPostcode = ({ value }) => {
    this.setState({
      postcodeSuggestions: helpers.getSuggestions(value, this.state.postcodes),
    });
  };

  handleSuggestionsClearRequestedPostcode = () => {
    this.setState({
      postcodeSuggestions: [],
    });
  };

  handlePostCodeChange = (event, { newValue }) => {
    event.preventDefault();
    this.setState(
      {
        postCode: newValue,
        isPostcode: true
      }
    );
  };

  render() {
    const { role} = this.props;
    const { editIdx, organisations, search, postcodeValue } = this.state;
    const params  = this.props.location.pathname;
    const isHomeRoute = params && params.includes('home');
    
    if (this.state.isLoading || homePageHelper.filterData.length === 0 || organisations.length <= 0) {
      return <Spinner />
    }
    const searchResult = (
      homePageHelper.filterData(organisations.sort(this.dataOrder()), search, postcodeValue)
          .map((org, index) => {const currentlyEditing = editIdx === index;
            return currentlyEditing ? (
              <Fragment>
                <EditOrganisation stopEditing={this.stopEditing} org={org} show />
                <SingleOrganisation stopEditing={this.stopEditing} handleShawDetails org={org} />
              </Fragment>)
          :(
            <Grid item xs={12} sm={6} key={org.id}>
              <OrganisationCard
                getData={() => this.editSelectedOrganisation(index)}
                org={org}
                index={index}
                isHomeRoute={isHomeRoute}
                role={role}
              />
            </Grid>);
            })
          );
    if (this.props.match.url.includes('/users') || this.props.match.url.includes('/admindos') ) {
      return null
    }

    let addNewOrganisation = null;
    // Conditionaly display add new organisation element on home page 
    if (role && (role === 'Admin' || role === 'Editor')) {
      addNewOrganisation = (
        <div> 
          <Link to='/services/service/add' className="add-orgnaization">  
            <span> Add a project </span>
            <Button className="add-orgonaization-button" variant="fab"  aria-label="add`">
              <AddIcon />
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="org-home">
        <div className="org-home_title"> 
          <h2> Search for projects in all categories </h2>
          { addNewOrganisation }
        </div>
        <Grid container className="organisation-page" spacing={24}>
          <SearchForm
            value={this.state.value}
            postCode={this.state.postCode}
            isHidden={this.state.isHidden}
            handleKeyUp={this.handleKeyUp}
            handleChange={this.handleChange}
            isPostcode={this.state.isPostcode}
            suggestions={this.state.suggestions}
            updateSearchData={this.updateSearchData}
            clearSearchField={this.clearSearchField}
            clearPostcodeField={this.clearPostcodeField}
            handlePostCodeChange={this.handlePostCodeChange}
            postcodeSuggestions={this.state.postcodeSuggestions}
            handleSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            handleSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            handleSuggestionsFetchRequestedPostcode={this.handleSuggestionsFetchRequestedPostcode}
            handleSuggestionsClearRequestedPostcode={this.handleSuggestionsClearRequestedPostcode}
          />
          {/* Bugs form link  */}
          {this.state.showLink && 
            <div className="bug-form">
              <h4>We would love your feedback {"  "}😍 </h4>
              <p>Please provide your feedback by clicking <a href="https://goo.gl/Jhy5Us" target="blank">here</a></p>
            </div>
          }
          { this.state.postcodeError ? <span className="postcode-error">{this.state.postcodeError}</span>
            : searchResult}
        </Grid>
      </div>
    );
  }
}

HomeSearch.propTypes = {
  getBranchesFilteredByPostCode: PropTypes.func.isRequired
};

export default connect(null, { getBranchesFilteredByPostCode })(withRouter(props => <HomeSearch {...props} />));
