import { createAppContainer, createStackNavigator } from 'react-navigation';

// Screen Imports
import Login from '../screens/Login/Login';

const AppNavigator = createStackNavigator({
    Login: Login
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;