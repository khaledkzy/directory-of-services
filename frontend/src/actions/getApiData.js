import axios from 'axios';
import { FILTERED_BRANCHS_BY_CATEGORY,  LIST_OF_ORGANISATIONS, LIST_OF_USERS } from './types';
import helpers from '../helpers';

const api = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCALHOST_API_URL;

export function setGetBranchsByCategory(branchs) {
  return {
    type: FILTERED_BRANCHS_BY_CATEGORY,
    branchs
  };
}

export function getBranchsByCategory(category) {
  const sendInfo = async (dispatch) => {
    try {
      const res = await axios.get(`${api}/service/category/?category=${category}`)
      return dispatch(setGetBranchsByCategory(res.data))
    } catch (error) {
      return helpers.errorParser(error)
    }
  }
  return sendInfo
}

export function setOrganisationsList(organisations) {
  return{
    type: LIST_OF_ORGANISATIONS,
    organisations
  }
}

export function getOrganisationsList(){
  const sendInfo = async (dispatch) => {
    try {
      const res = await axios.get(`${api}/service/all`)
      // Decode data 
      const data = window.atob(JSON.parse(res.data))
      return dispatch(setOrganisationsList(JSON.parse(data)))
    } catch (error) {
      return helpers.errorParser(error)
    }
  }
  return sendInfo
}

export function setListOfUsers(users) {
  return{
    type:LIST_OF_USERS,
    users
  }
}

export function getListOfUsers(){
  const sendInfo = async (dispatch) => {
    try {
      const res = await axios.get(`${api}/users`)
      return dispatch(setListOfUsers(res.data))
    } catch (error) {
      return helpers.errorParser(error)
    }
  }
  return sendInfo
}
