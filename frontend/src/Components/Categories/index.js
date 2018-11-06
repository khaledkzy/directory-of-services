import React from 'react';
import { NavLink } from 'react-router-dom';
import helpers from '../../helpers';
import categoriesData from '../../Data/Categories.json';
import './categories.css';

export default function Categories(){
  return (
    <div className="categories">
      <span
        tabIndex={0}
        role="button"
        className="categories-title"
      >
        Categories
      </span>
      <ul>
        {categoriesData.sort().map((category) =>
          (
            <li key={category + 1}>
              <NavLink to={`/services/${helpers.linkMaker(category)}`} activeClassName="is-active">{helpers.categoryNameMaker(category)}</NavLink>
            </li>
          )
        )}
      </ul>
      <a href="https://goo.gl/Jhy5Us" role="button" target="blank">Please Give Feedback</a>
    </div>
  );
}
