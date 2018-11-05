import React from 'react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Search from '../Components/Organisation/Search';

const middlewares = []
const mockStore = configureStore(middlewares)
configure({ adapter: new Adapter() });

describe('Search Component', () => {
    it('Should render without crashing', () => {
        const initialState = {}
        const store = mockStore(initialState)
      const wrapper = shallow(
        <Provider store={store}>
          <Search />
        </Provider>).length
      expect(wrapper).toEqual(1)
    })
})