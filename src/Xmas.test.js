import React from 'react';
import ReactDOM from 'react-dom';
import Xmas from './Xmas';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Xmas />, div);
  ReactDOM.unmountComponentAtNode(div);
});
