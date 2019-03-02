import React from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import { Font } from 'expo';

import AppContainer from './src/router/router';
import { store } from './src/redux/store';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isFontLoaded: false
    }

    console.disableYellowBox = true;
  }

  componentDidMount() {
    this.loadFonts();
  }

  loadFonts = async () => {
    await Font.loadAsync({
      Roboto_medium: require("./src/assets/fonts/Roboto-Medium.ttf")
    })

    this.setState({ isFontLoaded: true })
  }

  render() {
    const { isFontLoaded } = this.state;

    return (
      isFontLoaded &&
      <Root>
        <Provider store={store}>
          <AppContainer />
        </Provider>
      </Root>
    );
  }
}