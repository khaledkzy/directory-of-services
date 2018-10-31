import React from 'react'
import configureStore from 'redux-mock-store'
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BubbleIcon from '../Components/TopNav/BubbleIcon';

const middlewares = []
const mockStore = configureStore(middlewares)
configure({ adapter: new Adapter() });



describe('BubbleIcon Component', () => {
    it('Should render without crashing', () => {
        const initialState = {}
  const store = mockStore(initialState)
  const wrapper = shallow(
    <BubbleIcon  />,  { context: { store } }
   ).length
   expect(wrapper).toEqual(1)
  })
})