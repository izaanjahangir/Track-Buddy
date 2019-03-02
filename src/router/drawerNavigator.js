import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import Home from '../screens/Home/Home';

// Drawer Component
import Drawer from '../components/Drawer';

import variables from '../config/variables';

export default drawer = createDrawerNavigator({
    Home: {
        screen: createStackNavigator({ Home }),
    }
}, {
        contentComponent: Drawer,
        drawerWidth: variables.WINDOW_WIDTH * 0.8
    });