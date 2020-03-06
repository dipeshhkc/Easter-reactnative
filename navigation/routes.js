import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import CheckUser from '../components/utils/checkUser';

import HomeScreen from '../screens/Home';
import GeneralScreen from '../screens/general';
import ModalSetup from '../screens/modelSetup';

//Setup Screen
import SetupModalScreen from '../screens/Setup/modelSetup';
import LoginScreen from '../screens/Login/LoginScreen';

//Create Screen
import UserSetup from '../screens/User/addUser';

const NavHead = (Name, Title) => {
	return {
		screen: Name,
		navigationOptions: {
			headerTitleAlign: 'center',
			headerStyle: {
				backgroundColor: '#a72331',
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
	Home: NavHead(HomeScreen, 'Eastern'),
	ModalCreate: NavHead(ModalSetup, 'Model Create'),
	ViewScreen: NavHead(GeneralScreen, 'Search & View'),

	//Setup Part
	SetupModal: NavHead(SetupModalScreen, 'Modal Setup'),
	AddUser: NavHead(UserSetup, 'Add User'),
});

const loginSwitch = createSwitchNavigator({
	CheckUser: CheckUser,
	Login: NavHead(LoginScreen, 'Login Screen'),
	Home: Routes,
});

export default createAppContainer(loginSwitch);
