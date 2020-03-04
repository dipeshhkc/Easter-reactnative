import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/Home';
import GeneralScreen from '../screens/general';
import ModalSetup from '../screens/modelSetup';

//Setup Screen
import SetupModalScreen from '../screens/Setup/modelSetup';
import LoginScreen from '../screens/Login/LoginScreen';

const NavHead = (Name, Title) => {
    return {
        screen: Name,
        navigationOptions: {
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#0c4ca3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontSize: 17,
                fontWeight: 'bold',
            },
            headerTitle: Title,
        },
    };
};

const Routes = createStackNavigator({
    // Login: NavHead(LoginScreen,'Login Screen'),
    // Home: NavHead(HomeScreen, 'Eastern Agencies Pvt. Ltd'),
    // ModalCreate: NavHead(ModalSetup, 'Model Create'),
    ViewScreen: NavHead(GeneralScreen, 'Search & View'),

    //Setup Part
    SetupModal: NavHead(SetupModalScreen, 'Modal Setup'),
});

export default createAppContainer(Routes);
