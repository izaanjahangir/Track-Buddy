import React from 'react';
import AppContainer from './src/router/router';
export default class App extends React.Component {
  render() {
    console.disableYellowBox = true;
    
    return (
      <AppContainer />
    );
  }
}