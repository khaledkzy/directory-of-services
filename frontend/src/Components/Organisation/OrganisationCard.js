import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from './PaperOrg';
import SingleOrganisation from './SingleOrganisation';
import './index.css';


const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
  wrapper: {
    maxWidth: 400,
  },
  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    width: '50%',
  },
});

const OrganisationCard = ({
  role,
  org,
  isHomeRoute
}) => (
  <Paper label='org-card-info'>
    <SingleOrganisation org={org} role={role} />
    { /*  Conditionally display services and process, if no info provided display  'not provided' in FE */ }
    { org.org_name ?
      <span className={org.distance || org.distance === null ? 'org-distance': ''}>
        <h1>{org.org_name}</h1>
        {org.distance && org.distance !== null ? <p>{(org.distance).toFixed(1)} miles</p>
        :
        org.distance === null ? <p>Distance is not available</p> : null}
      </span>
      :
      <h1 className="not-available"> Add organisation name ...</h1>
      }
    <h6> Area: {org.area ? org.area : 'Add area   ...'} | Borough: {org.borough ? org.borough : 'Add borough ...'}</h6>
    {isHomeRoute && <h6> Category: {org.cat_name ? org.cat_name : 'Add Category ...'}</h6>
    }
    <div className="org-card-services">

      {org.clients && org.clients.length > 1? <p> <span className="title"> <img src="https://png.icons8.com/material-outlined/17/1abcd4/gender-neutral-user.png" alt="administrative-tools" className="material-icons org-card-icon" /> </span> {org.clients}</p>
      :
      <p> <span className="title"> <img src="https://png.icons8.com/material-outlined/17/1abcd4/gender-neutral-user.png" alt="administrative-tools" className="material-icons org-card-icon" /> </span><span className="not-available">Add clientss ...</span></p>}

      {org.service.length > 1? <p> <span className="title"> <img src="https://png.icons8.com/material/17/1abcd4/administrative-tools.png" alt="administrative-tools" className="material-icons org-card-icon" /> </span> {org.service}</p>
      :
      <p> <span className="title"> <img src="https://png.icons8.com/material/17/1abcd4/administrative-tools.png" alt="administrative-tools" className="material-icons org-card-icon" /> </span><span className="not-available">Add services ...</span></p>}

      {org.process.length > 1? <p> <span className="title"> <i className="material-icons org-card-icon">access_time</i> </span> {org.process.replace(/\s+/g, " ")} </p>
      :
      <p> <span className="title"> <i className="material-icons org-card-icon">access_time</i> </span><span className="not-available"> Add process ... </span></p>}
    </div>

  </Paper>
  );

export default withStyles(styles)(OrganisationCard);
