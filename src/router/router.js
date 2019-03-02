import { createAppContainer, createSwitchNavigator } from 'react-navigation';

// Screen Imports
import Login from '../screens/Login/Login';

// Drawer Navigator
import Drawer from './drawerNavigator';

const AppNavigator = createSwitchNavigator({
    Login: Login,
    Drawer: Drawer
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;