import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './src/router/router';
import { store } from './src/redux/store';

export default class App extends React.Component {
  render() {
    console.disableYellowBox = true;

    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}