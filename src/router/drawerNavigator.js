import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import Home from '../screens/Home/Home';
import EditProfile from '../screens/EditProfile/EditProfile';

// Drawer Component
import Drawer from '../components/Drawer';

import variables from '../config/variables';

import CreateCircle from '../screens/CreateCircle/CreateCircle';
import AddMembers from '../screens/AddMembers/AddMembers';
import JoinCircle from '../screens/JoinCircle/JoinCircle';

export default drawer = createDrawerNavigator({
    Home: createStackNavigator({ Home, CreateCircle, AddMembers, JoinCircle }),
    EditProfile: createStackNavigator({ EditProfile }),
}, {
        contentComponent: Drawer,
        drawerWidth: variables.WINDOW_WIDTH * 0.8
    });