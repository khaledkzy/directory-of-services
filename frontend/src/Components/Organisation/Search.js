import React from "react";
import { connect } from "react-redux";
import Button from "material-ui/Button";
import PropTypes from "prop-types";
import Grid from "material-ui/Grid";
import { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import Autosuggest from "react-autosuggest";
import { withStyles } from "material-ui/styles";
import "react-select/dist/react-select.css";
import helpers from "../../helpers";
import searchStyle from "./searchStyle";
import "./search.css";
import { getOrganisationsList } from '../../actions/getApiData';


const days = [
  {
    id: 1,
    day: "Monday"
  },
  {
    id: 2,
    day: "Tuesday"
  },
  {
    id: 3,
    day: "Wednesday"
  },
  {
    id: 4,
    day: "Thursday"
  },
  {
    id: 5,
    day: "Friday"
  },
  {
    id: 6,
    day: "Saturday"
  },
  {
    id: 7,
    day: "Sunday"
  },
  {
    id: 8,
    day: "Mon-Fri"
  },
  {
    id: 9,
    day: "All"
  }
];

class Search extends React.Component {
  state = {
    suggestions: [],
    organisations: []
  };
  componentWillReceiveProps(newProps) {
    (() => {
      const org = []
      newProps.organisations.map(organisation => org.push({postCode: organisation.postcode}))
      const filterOrg = org.filter((element, index, self) =>
      index === self.findIndex((current) => (
        current.postCode === element.postCode
        ))
        )
        this.setState({organisations: filterOrg})
      })()
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: helpers.getSuggestions(value, this.state.organisations)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={24} className="org-search">
        <Grid item md={5} xs={12} className="post-code">
          <span className="postcode-field">
            <Autosuggest
              theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion
              }}
              className="post-code-suggesition"
              renderInputComponent={helpers.renderInput}
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
              renderSuggestionsContainer={helpers.renderSuggestionsContainer}
              getSuggestionValue={helpers.getSuggestionValue}
              renderSuggestion={helpers.renderSuggestion}
              inputProps={{
                classes,
                placeholder: "Enter postcode or borough...",
                name: "postCode",
                value: this.props.searchInput,
                onChange: this.props.handlePostCodeChange,
                onKeyUp: this.props.handleKeyUp
              }}
            />
            <button
              variant="raised"
              size="small"
              color="secondary"
              className={
                !this.props.isPostcode || this.props.searchInput.length < 1
                  ? "hidden"
                  : "clear-postcode"
              }
              onClick={this.props.clearPostcodeField}
            >
              <i className="material-icons" size="small" variant="raised">
                close
              </i>
            </button>
            <span className="postcode-error">{this.props.postcodeError}</span>
          </span>
          <Button
            variant="fab"
            mini
            color="secondary"
            onClick={this.props.handlePostSearch}
            aria-label="add"
            className="search-button"
          >
            <i className="material-icons">search</i>
          </Button>
        </Grid>
        <Grid item md={4} xs={12} className="day">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Day</InputLabel>
            <Select
              className="select-field-container day-small-screen"
              value={this.props.day}
              onChange={this.props.handleSelectedDay}
              inputProps={{
                name: "day",
                id: "day"
              }}
            >
              <MenuItem value="">
                <em>Any Day</em>
              </MenuItem>
              {days.map(day => (
                <MenuItem key={day.id} value={day.day}>
                  {day.day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    organisations: state.filteredBranchsByCategory.branchs
  }
}
export default connect(mapStateToProps , { getOrganisationsList })(withStyles(searchStyle.styles)(Search));
